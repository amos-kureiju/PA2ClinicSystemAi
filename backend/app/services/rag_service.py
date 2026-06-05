# backend/app/services/rag_service.py
# ════════════════════════════════════════════════════════════════
# FIX:
#   1. k=3 (lebih sedikit chunk → respons lebih cepat)
#   2. Prompt KETAT: AI hanya boleh jawab dari PDF/DB
#   3. History mapping: handle 'bot' & 'assistant'
#   4. Temperature 0.1 (lebih presisi, kurang hallucinate)
# ════════════════════════════════════════════════════════════════

import os
from langchain_cohere import ChatCohere, CohereEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_classic.chains import create_history_aware_retriever
from langchain_core.messages import HumanMessage, AIMessage
from app.core.config import settings

os.environ["COHERE_API_KEY"]   = settings.COHERE_API_KEY
os.environ["PINECONE_API_KEY"] = settings.PINECONE_API_KEY


class ChatbotService:
    def __init__(self):
        try:
            print(f"[INFO] Inisialisasi Chatbot → Index: {settings.PINECONE_INDEX_NAME}")

            # ── 1. Embedding & Vectorstore ──────────────────────────────────
            self.embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")
            self.vectorstore = PineconeVectorStore(
                index_name=settings.PINECONE_INDEX_NAME,
                embedding=self.embeddings,
            )
            # Temperature rendah → lebih presisi, tidak mengarang
            self.llm = ChatCohere(
                model="command-r-plus-08-2024",
                temperature=0.1,
                max_tokens=512,   # batasi panjang jawaban → respons lebih cepat
            )

            # ── 2. Prompt: sederhanakan pertanyaan berdasar history ─────────
            contextualize_q_prompt = ChatPromptTemplate.from_messages([
                (
                    "system",
                    "Sederhanakan pertanyaan pengguna menjadi pertanyaan mandiri "
                    "berdasarkan riwayat chat. JANGAN jawab—hanya reformulasikan "
                    "jika perlu. Jika sudah jelas, kembalikan apa adanya.",
                ),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}"),
            ])

            # k=3 → ambil 3 chunk paling relevan (cukup akurat, lebih cepat dari k=5)
            self.history_aware_retriever = create_history_aware_retriever(
    self.llm,
    self.vectorstore.as_retriever(
        search_kwargs={
            "k": 10,  # Ambil 10 potongan teks (karena chunk kita sekarang kecil)
            # Hapus score_threshold agar tidak memblokir jawaban yang mungkin relevan
        }
    ),
    contextualize_q_prompt,
)

            # ── 3. Prompt utama: WAJIB dari dokumen ───────────────────────
            system_prompt = """Anda adalah "KlinikAI", asisten resmi Nauli Dental Care Balige.

SUMBER INFORMASI ANDA (Wajib dibaca teliti):
{context}

ATURAN JAWABAN:
1. Jika ditanya soal DOKTER, sebutkan SEMUA nama dokter yang ada di konteks tanpa terkecuali.
2. Jika ditanya soal HARGA, berikan detail harga sesuai yang tertulis.
3. Jika jawaban ADA di konteks -> jawab ramah & jelas, awali "Horas!".
4. Jika jawaban TIDAK ADA di konteks -> jawab: "Horas! Maaf, informasi tersebut belum tersedia di data kami. Silakan hubungi WA 0821-6352-6363."
5. Jawab dalam Bahasa Indonesia yang profesional."""

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
            print("[INFO] Chatbot Service siap!")

        except Exception as e:
            print(f"[ERROR] Gagal inisialisasi ChatbotService: {e}")
            raise

    def get_response(self, query: str, history: list = []) -> str:
        try:
            # Konversi history → LangChain format
            # Terima 'bot' maupun 'assistant' (fallback aman)
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
                # role tak dikenal → abaikan

            # Batasi history ke 6 pesan terakhir agar tidak memperlambat
            chat_history = chat_history[-6:]

            print(f"[CHAT] Pertanyaan : {query[:80]}{'...' if len(query)>80 else ''}")
            print(f"[CHAT] History    : {len(chat_history)} pesan")

            result = self.rag_chain.invoke({
                "input":        query,
                "chat_history": chat_history,
            })

            answer = (result.get("answer") or "").strip()
            if not answer:
                return (
                    "Horas! Maaf, saya tidak dapat menemukan jawaban yang tepat. "
                    "Silakan hubungi WA 0821-6352-6363."
                )

            print(f"[CHAT] Jawaban    : {len(answer)} karakter")
            return answer

        except Exception as e:
            print(f"[ERROR] get_response: {e}")
            raise