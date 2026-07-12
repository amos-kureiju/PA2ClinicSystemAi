import os
import sys

# Tambahkan path root agar modul app terbaca
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app.core.config import settings

try:
    from pinecone import Pinecone
except ImportError:
    print("Gagal mengimpor pinecone. Pastikan virtual environment venv aktif.")
    sys.exit(1)

def main():
    print("Mengubungi Pinecone Database...")
    # Inisialisasi Pinecone Client
    pc = Pinecone(api_key=settings.PINECONE_API_KEY)
    
    # Hubungkan ke index Anda
    index = pc.Index(settings.PINECONE_INDEX_NAME)
    
    try:
        # 1. Ambil statistik Index
        stats = index.describe_index_stats()
        print("\n==================================================")
        print("   BUKTI DATABASE VEKTOR PINECONE (STATISTIK)    ")
        print("==================================================")
        print(f"Nama Index      : {settings.PINECONE_INDEX_NAME}")
        print(f"Total Vektor    : {stats['total_vector_count']} vektor")
        print(f"Dimensi Vektor  : {stats.get('dimension', 1024)} dimensi")
        print(f"Detail Stats    : {stats}")
        print("==================================================\n")
        
        # 2. Ambil contoh 1 Vektor beserta nilai array-nya dan metadatanya
        # Menggunakan non-zero dummy vector 1024 dimensi agar tidak eror di metrik cosine
        dummy_vector = [0.1] * 1024
        results = index.query(
            vector=dummy_vector, 
            top_k=1, 
            include_values=True, 
            include_metadata=True
        )
        
        if results.matches:
            match = results.matches[0]
            print("==================================================")
            print("   CONTOH DATA VEKTOR ASLI (BUKTI NILAI VEKTOR)  ")
            print("==================================================")
            print(f"ID Vektor : {match.id}")
            print(f"Nilai Vektor (15 angka pertama dari 1024 dimensi):")
            print(match.values[:15])
            print("... [sisa 1009 angka disembunyikan]")
            print("\nMetadata (Teks Asli dari PDF Dokumen):")
            print(f"-> Source: {match.metadata.get('source', 'Tidak diketahui')}")
            print(f"-> Text  : {match.metadata.get('text', 'Tidak ada teks')[:300]}...")
            print("==================================================")
        else:
            print("Index kosong. Jalankan ingest_data.py terlebih dahulu.")
            
    except Exception as e:
        print(f"Terjadi kesalahan saat mengambil data: {e}")

if __name__ == "__main__":
    main()
