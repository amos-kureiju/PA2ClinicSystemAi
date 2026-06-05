# backend/app/api/endpoints/chatbot.py
# ════════════════════════════════════════════════════════════════
# FIX:
#   1. Ingest: RecursiveCharacterTextSplitter (chunk 400/overlap 60)
#   2. Ingest: from_texts DB + add_documents PDF (tidak tumpang tindih)
#   3. Ingest: gabung dari DB (dokter, layanan) + PDF rekursif
#   4. Chat  : timeout info ada di error log
# ════════════════════════════════════════════════════════════════

import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict
from pathlib import Path

from app.services.rag_service import ChatbotService
from app.database.session import get_db
from app.models.clinic import Doctor, Service, ChatLog
from app.core.security import get_current_user
from app.core.config import settings

from langchain_cohere import CohereEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

router = APIRouter()

# ── Path ke folder docs (rekursif dari lokasi file ini) ─────────────────────
current_file = Path(__file__).resolve()
ROOT_DIR     = current_file.parents[4]   # clinic-system/
PATH_MATERI  = ROOT_DIR / "docs"

print(f"[DEBUG] Folder docs: {PATH_MATERI}")

# Inisialisasi service (singleton)
chatbot_service = ChatbotService()


# ══════════════════════════════════════════════════════════════════════════════
# SCHEMA
# ══════════════════════════════════════════════════════════════════════════════

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []


class FeedbackRequest(BaseModel):
    user_message: str
    bot_response: str
    feedback: bool
    session_id: str


# ══════════════════════════════════════════════════════════════════════════════
# 1. CHAT
# ══════════════════════════════════════════════════════════════════════════════

@router.post("/chat")
async def chat_with_bot(request: ChatRequest):
    try:
        answer = chatbot_service.get_response(request.message, request.history)
        return {"reply": answer}
    except Exception as e:
        print(f"[ERROR] /chat: {e}")
        raise HTTPException(
            status_code=500,
            detail="AI sedang sibuk. Coba lagi dalam beberapa detik."
        )


# ══════════════════════════════════════════════════════════════════════════════
# 2. FEEDBACK
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/chat/history")
async def get_chat_history():
    return []   # placeholder agar tidak 404


@router.post("/log-feedback")
async def log_feedback(data: FeedbackRequest, db: Session = Depends(get_db)):
    new_log = ChatLog(
        session_id=data.session_id,
        user_message=data.user_message,
        bot_response=data.bot_response,
        feedback=data.feedback,
    )
    db.add(new_log)
    db.commit()
    return {"status": "recorded"}


# ══════════════════════════════════════════════════════════════════════════════
# 3. STATISTIK ADMIN
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/admin/stats")
def get_ai_stats(db: Session = Depends(get_db)):
    likes    = db.query(ChatLog).filter(ChatLog.feedback == True).count()
    dislikes = db.query(ChatLog).filter(ChatLog.feedback == False).count()
    total    = likes + dislikes
    accuracy = round(likes / total * 100, 1) if total > 0 else 0
    return {
        "likes":              likes,
        "dislikes":           dislikes,
        "accuracy":           accuracy,
        "total_interactions": db.query(ChatLog).count(),
    }


@router.get("/admin/history")
def get_ai_history(db: Session = Depends(get_db)):
    return db.query(ChatLog).order_by(ChatLog.created_at.desc()).limit(20).all()


# ══════════════════════════════════════════════════════════════════════════════
# 4. INGEST — SINKRONISASI AI  ← PERBAIKAN UTAMA
# ══════════════════════════════════════════════════════════════════════════════

@router.post("/ingest")
async def sync_chatbot_knowledge(db: Session = Depends(get_db)):
    """
    Gabungkan 2 sumber data ke Pinecone:
      A. Teks dari Database (dokter, layanan, info klinik)
      B. PDF dari folder /docs/** (rekursif)

    Semua teks dipecah jadi chunk kecil sebelum diupload.
    """
    try:
        os.environ["COHERE_API_KEY"]   = settings.COHERE_API_KEY
        os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY

        embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")

        # ── Text splitter (berlaku untuk DB & PDF) ──────────────────────────
        splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,     # Diperkecil agar lebih fokus pada per baris/poin
        chunk_overlap=100,   # Overlap ditingkatkan agar tidak ada teks terpotong di tengah
        separators=["\n\n", "\n", "•", ". ", " ", ""], # Tambahkan separator poin (•)
        
)

        all_docs: list[Document] = []

        # ── A. Data dari Database ───────────────────────────────────────────
        db_texts = [
            "Klinik Nauli Dental Care berlokasi di Jl. Balige No. 12, Toba, Sumatera Utara.",
            "Jam operasional klinik: Senin–Sabtu 08:00–20:00.",
            "Pendaftaran dapat dilakukan melalui website, WhatsApp, atau langsung ke klinik.",
            "Nomor WhatsApp klinik: 0821-6352-6363.",
        ]

        # Dokter
        doctors = db.query(Doctor).all()
        for d in doctors:
            jadwal = "Jadwal belum diatur"
            if d.schedules:
                try:
                    jadwal = ", ".join(
                        f"{s['day']} jam {s['time']} di {s.get('loc','klinik')}"
                        for s in d.schedules
                    )
                except Exception:
                    jadwal = str(d.schedules)
            db_texts.append(
                f"Dokter {d.name} adalah spesialis {d.specialty}. "
                f"Jadwal praktik: {jadwal}. Pengalaman: {d.experience or '-'} tahun."
            )

        # Layanan
        services = db.query(Service).all()
        for s in services:
            db_texts.append(
                f"Layanan: {s.name}. "
                f"Biaya estimasi: Rp {s.price:,} (jika tersedia). "
                f"Deskripsi: {s.description or '-'}. "
                f"Detail prosedur: {s.detail_info or '-'}."
            )

        # Konversi teks DB → Document lalu chunk
        db_documents = [Document(page_content=t, metadata={"source": "database"}) for t in db_texts]
        all_docs.extend(splitter.split_documents(db_documents))
        print(f"[INGEST] DB → {len(all_docs)} chunk")

        # ── B. PDF dari folder /docs ────────────────────────────────────────
        pdf_count = 0
        if PATH_MATERI.exists():
            try:
                loader   = DirectoryLoader(
                    str(PATH_MATERI),
                    glob="**/*.pdf",
                    loader_cls=PyPDFLoader,
                    show_progress=True,
                )
                pdf_raw  = loader.load()
                pdf_docs = splitter.split_documents(pdf_raw)
                all_docs.extend(pdf_docs)
                pdf_count = len(pdf_raw)
                print(f"[INGEST] PDF → {pdf_count} halaman → {len(pdf_docs)} chunk")
            except Exception as e:
                print(f"[WARN] Gagal baca PDF: {e}")
        else:
            print(f"[WARN] Folder docs tidak ada: {PATH_MATERI}")

        if not all_docs:
            raise HTTPException(
                status_code=400,
                detail="Tidak ada data untuk di-ingest. Pastikan database & folder docs terisi."
            )

        # ── C. Upload ke Pinecone ───────────────────────────────────────────
        print(f"[INGEST] Total upload: {len(all_docs)} chunk ke Pinecone...")
        PineconeVectorStore.from_documents(
            documents=all_docs,
            embedding=embeddings,
            index_name=settings.PINECONE_INDEX_NAME,
            pinecone_api_key=settings.PINECONE_API_KEY,
        )

        return {
            "message": (
                f"✅ Sinkronisasi selesai! AI telah mempelajari "
                f"{len(doctors)} dokter, {len(services)} layanan, "
                f"dan {pdf_count} halaman PDF "
                f"({len(all_docs)} chunk total)."
            ),
            "total_chunks": len(all_docs),
            "pdf_pages":    pdf_count,
            "db_entries":   len(doctors) + len(services),
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] /ingest: {e}")
        raise HTTPException(status_code=500, detail=f"Gagal sinkronisasi: {str(e)}")


# ══════════════════════════════════════════════════════════════════════════════
# 5. LIST FILE PDF
# ══════════════════════════════════════════════════════════════════════════════

@router.get("/knowledge-files")
async def list_knowledge_files():
    try:
        if not PATH_MATERI.exists():
            return []
        return [
            {
                "name":     p.name,
                "category": p.parent.name if p.parent.name != "docs" else "Utama",
                "size_kb":  round(p.stat().st_size / 1024, 1),
            }
            for p in PATH_MATERI.rglob("*.pdf")
        ]
    except Exception as e:
        print(f"[ERROR] /knowledge-files: {e}")
        return []