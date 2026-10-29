# backend/app/services/rag_service.py
# ════════════════════════════════════════════════════════════════
# FIX KRITIS — 3 perubahan utama:
#
#   1. IMPORT BENAR:
#      langchain_classic → TIDAK ADA (penyebab error & skor 44%)
#      Ganti ke: from langchain.chains import ...
#
#   2. k=6, temperature=0.0 → lebih akurat, tidak mengarang
#
#   3. Prompt lebih detail → sebutkan semua dokter & harga
# ════════════════════════════════════════════════════════════════

import os
from langchain_cohere import ChatCohere, CohereEmbeddings
from langchain_pinecone import PineconeVectorStore

# ── FIX IMPORT untuk langchain/langchain_classic ─────────────────
try:
    from langchain_classic.chains.retrieval import create_retrieval_chain
    from langchain_classic.chains.history_aware_retriever import create_history_aware_retriever
    from langchain_classic.chains.combine_documents import create_stuff_documents_chain
except ImportError:
    try:
        from langchain.chains.retrieval import create_retrieval_chain
        from langchain.chains.history_aware_retriever import create_history_aware_retriever
        from langchain.chains.combine_documents import create_stuff_documents_chain
    except ImportError:
        from langchain.chains import create_retrieval_chain
        from langchain.chains import create_history_aware_retriever
        from langchain.chains.combine_documents import create_stuff_documents_chain
# ─────────────────────────────────────────────────────────────────

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from app.core.config import settings

os.environ["COHERE_API_KEY"]   = settings.COHERE_API_KEY
os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY


class ChatbotService:
    def __init__(self):
        self.embeddings = None
        self.vectorstore = None
        self.llm = None
        self.history_aware_retriever = None
        self.rag_chain = None
        self.is_ready = False
        
        self.initialize_service()

    def initialize_service(self):
        try:
            print(f"[INFO] Inisialisasi Chatbot - Index: {settings.PINECONE_INDEX_NAME}")

            # ── 1. Embedding & Vectorstore ──────────────────────────────────
            self.embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")
            self.vectorstore = PineconeVectorStore(
                index_name=settings.PINECONE_INDEX_NAME,
                embedding=self.embeddings,
            )

            # temperature=0.0 → deterministik, tidak mengarang sama sekali
            self.llm = ChatCohere(
                model="command-r-plus-08-2024",
                temperature=0.0,
                max_tokens=600,
            )

            # ── 2. Prompt kontekstualisasi riwayat ─────────────────────────
            contextualize_q_prompt = ChatPromptTemplate.from_messages([
                (
                    "system",
                    "Ubah pertanyaan pengguna menjadi pertanyaan mandiri "
                    "berdasarkan riwayat chat. JANGAN jawab. "
                    "Jika sudah jelas, kembalikan apa adanya.",
                ),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ])

            # k=6 → ambil 6 chunk agar info yang tersebar di PDF tetap terjangkau
            self.history_aware_retriever = create_history_aware_retriever(
                self.llm,
                self.vectorstore.as_retriever(search_kwargs={"k": 6}),
                contextualize_q_prompt,
            )

            # ── 3. Prompt utama: KETAT + instruksi DETAIL ──────────────────
            system_prompt = """Anda adalah asisten medis resmi "KlinikAI" dari Nauli Dental Care Balige.

INFORMASI PASIEN YANG SEDANG BERTANYA (dari Database, real-time):
{personal_context}

TUGAS: Jawab pertanyaan pasien berdasarkan KONTEKS DOKUMEN di bawah ini secara mendetail dan akurat.

KONTEKS DOKUMEN:
{context}

ATURAN WAJIB:
1. Gunakan informasi dari KONTEKS DOKUMEN dan INFORMASI PASIEN sebagai prioritas utama. Jangan mengarang data spesifik klinik (seperti jadwal, harga, atau daftar dokter) yang tidak tercantum di dokumen.
2. [Opsi A - Guardrails]: Jika pengguna menanyakan topik di luar kesehatan gigi, kedokteran gigi, atau informasi klinik Nauli Dental Care Balige (misalnya topik politik, resep masakan, matematika, pemrograman, sains umum, dll), Anda WAJIB menolak secara sopan menggunakan kalimat persis seperti berikut:
   "Maaf, sebagai asisten medis KlinikAI, saya hanya dapat membantu menjawab pertanyaan seputar kesehatan gigi, layanan, jadwal dokter, dan informasi di Nauli Dental Care Balige. Ada yang bisa saya bantu terkait kesehatan gigi Anda?"
3. [Opsi B - Edukasi Umum + CTA]: Jika pasien bertanya mengenai keluhan medis gigi secara umum (misal: "Mengapa gigi saya sering ngilu saat minum dingin?") tetapi penjelasannya tidak ada secara mendetail di KONTEKS DOKUMEN, Anda diperbolehkan memberikan penjelasan medis dasar secara umum (menggunakan basis pengetahuan umum Anda), namun WAJIB diakhiri dengan anjuran konsultasi seperti berikut:
   "Namun, untuk mendapatkan diagnosa yang akurat dan penanganan yang tepat, kami menyarankan Anda memeriksakan diri langsung ke dokter gigi kami. Apakah Anda ingin saya jadwalkan konsultasi dengan dokter gigi Nauli Dental Care?"
4. Jika ditanya NAMA DOKTER → sebutkan SEMUA nama dokter dari konteks.
5. Jika ditanya HARGA → sebutkan angka persis dari konteks.
6. Jika ditanya GEJALA/PENANGANAN → jelaskan sesuai data, berikan detail.
7. Jika informasi non-medis klinik (seperti harga layanan spesifik, jadwal operasional/dokter tertentu, dll) TIDAK ADA di konteks → balas:
   "Horas! Maaf, informasi tersebut belum tersedia di data kami.
   Hubungi WA 0821-6352-6363 atau kunjungi Jl. Balige No. 12, Toba."
8. Gunakan sapaan "Horas!" hanya di awal jawaban positif.
9. Jawab dalam Bahasa Indonesia yang ramah dan profesional.
10. Jika pasien menyebutkan keluhan serius atau ingin diperiksa langsung, tanyakan dengan ramah: "Apakah Anda ingin saya bantu jadwalkan konsultasi dengan dokter kami sekarang?"
11. Jika pasien menyebut nama dokter spesifik (misal "drg. Yetti"), konfirmasikan: "Baik, saya akan teruskan permintaan Anda ke drg. Yetti. Tim kami akan segera menghubungi Anda."
12. Jangan berpura-pura sudah membuat jadwal — cukup sampaikan bahwa permintaan sedang diteruskan ke tim medis.
13. Jika INFORMASI PASIEN menunjukkan PASIEN LAMA, sapa dengan hangat dan sebutkan riwayat singkatnya bila relevan dengan pertanyaan.
14. Jika INFORMASI PASIEN menunjukkan PASIEN BARU, sambut ramah dan tawarkan pendaftaran/konsultasi pertama."""


            qa_prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ])

            # ── 4. Rakit RAG chain ─────────────────────────────────────────
            question_answer_chain = create_stuff_documents_chain(self.llm, qa_prompt)
            self.rag_chain = create_retrieval_chain(
                self.history_aware_retriever, question_answer_chain
            )
            self.is_ready = True
            print("[INFO] Chatbot Service siap!")

        except Exception as e:
            self.is_ready = False
            print(f"[ERROR] Gagal inisialisasi ChatbotService (koneksi bermasalah): {e}")

    def get_response(self, query: str, history: list = [], personal_context: str = "") -> str:
        # Coba inisialisasi ulang jika sebelumnya gagal (misal koneksi kembali tersedia)
        if not self.is_ready:
            print("[INFO] Mencoba inisialisasi ulang ChatbotService...")
            self.initialize_service()

        if not self.is_ready:
            return (
                "Horas! Maaf, saat ini layanan asisten AI sedang mengalami gangguan koneksi ke basis data pengetahuan kami. "
                "Silakan tanyakan langsung melalui WhatsApp di nomor 0821-6352-6363 atau kunjungi klinik kami."
            )
        try:
            # ── Konversi history → LangChain format ──────────────────────
            chat_history = []
            for msg in history:
                role    = msg.get("role", "")
                content = msg.get("content", "").strip()
                if not content:
                    continue
                if role == "user":
                    chat_history.append(HumanMessage(content=content))
                elif role in ("assistant", "bot"):
                    chat_history.append(AIMessage(content=content))

            chat_history = chat_history[-6:]

            # ── Debug: tampilkan chunk yang diambil ───────────────────────
            debug_docs = self.vectorstore.similarity_search(query, k=6)
            print(f"\n[DEBUG] Query  : {query[:80]}")
            print(f"[DEBUG] Chunks : {len(debug_docs)} ditemukan")
            for i, d in enumerate(debug_docs):
                print(f"        [{i+1}] {d.page_content[:100].strip()}")

            result = self.rag_chain.invoke({
                "input":        query,
                "chat_history": chat_history,
                "personal_context": personal_context,
            })

            answer = (result.get("answer") or "").strip()
            if not answer:
                return (
                    "Horas! Maaf, saya tidak menemukan jawaban yang tepat. "
                    "Hubungi WA 0821-6352-6363."
                )

            print(f"[CHAT] Jawaban : {len(answer)} karakter")
            return answer

        except Exception as e:
            print(f"[ERROR] get_response: {e}")
            raise