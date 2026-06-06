# Sequence Diagrams - ClinicAi

Dokumen ini memuat Sequence Diagram lengkap untuk setiap Use Case yang ada pada rancangan sistem ClinicAi, disesuaikan dengan arsitektur REST API (FastAPI) dan Frontend (Next.js) yang ada pada sistem informasi saat ini.

---

    ## 1. Autentikasi (Umum untuk Semua Aktor)

    ### 1.1 Login (termasuk *Verifikasi Akun*)
    ```mermaid
    sequenceDiagram
        participant A as Aktor (User/Dokter/Admin/Perawat)
        participant UI as Frontend
        participant API as Backend (auth.py)
        participant DB as Database
        A->>UI: Input Email & Password
        UI->>API: POST /login
        API->>DB: Cek Email User
        DB-->>API: Data User & Password Hash
        API->>API: Verifikasi Password Hash
        alt Kredensial Valid
            API-->>UI: Return Access Token (JWT)
            UI->>API: GET /me (mengambil role & data user)
            API-->>UI: Return Data User
            UI-->>A: Redirect ke Dashboard Sesuai Role
        else Kredensial Invalid
            API-->>UI: 401 Unauthorized
            UI-->>A: Tampilkan Pesan Error
        end
    ```

### 1.2 Logout
```mermaid
sequenceDiagram
    participant A as Aktor
    participant UI as Frontend
    A->>UI: Klik tombol Logout
    UI->>UI: Hapus Token JWT dari LocalStorage/Cookies
    UI-->>A: Redirect ke Halaman Login
```

---

## 2. User / Pasien

### 2.1 Melihat Dashboard
```mermaid
sequenceDiagram
    participant P as Pasien
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    P->>UI: Akses Halaman Utama/Dashboard Pasien
    UI->>API: GET /appointments/me
    API->>DB: Query Riwayat Reservasi Pasien
    DB-->>API: Data Appointments
    API-->>UI: Return Data Reservasi Mendatang & Selesai
    UI-->>P: Tampilkan Dashboard Pasien
```

### 2.2 Membuat Janji Temu
```mermaid
sequenceDiagram
    participant P as Pasien
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    P->>UI: Buka Menu Buat Janji Temu
    UI->>API: GET /doctors & GET /services
    API->>DB: Query Dokter & Layanan Aktif
    DB-->>API: Data List Dokter & Layanan
    API-->>UI: Return Data Pilihan
    UI-->>P: Tampilkan Form Pemilihan
    P->>UI: Pilih Dokter, Layanan, Tanggal, & Waktu
    UI->>API: POST /appointments
    API->>DB: Simpan Record Appointment Baru (Status: pending)
    DB-->>API: Berhasil
    API-->>UI: Return Detail Appointment
    UI-->>P: Tampilkan Notifikasi Janji Temu Berhasil
```

### 2.3 Melihat Jadwal Dokter
```mermaid
sequenceDiagram
    participant P as Pasien
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    P->>UI: Akses Menu Jadwal Dokter
    UI->>API: GET /doctors
    API->>DB: Ambil Data Semua Dokter beserta Jadwal Praktiknya
    DB-->>API: Data Dokter
    API-->>UI: Return Data Dokter
    UI-->>P: Tampilkan Daftar Dokter & Jadwalnya
```

### 2.4 Melihat Layanan Klinik
```mermaid
sequenceDiagram
    participant P as Pasien
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    P->>UI: Akses Menu Layanan Klinik
    UI->>API: GET /services
    API->>DB: Ambil Semua Data Layanan Klinik
    DB-->>API: Data Layanan
    API-->>UI: Return Daftar Layanan
    UI-->>P: Tampilkan Informasi Layanan (Harga, Kategori, dll)
```

### 2.5 Chat AI / Klinik AI
```mermaid
sequenceDiagram
    participant P as Pasien
    participant UI as Frontend
    participant API as Backend (chatbot.py)
    participant AI as Model AI (Google Gemini / RAG)
    P->>UI: Buka Chat AI & Ketik Pesan
    UI->>API: POST /chat
    API->>AI: Proses Context & Kirim Prompt ke Model
    AI-->>API: Respons Teks dari Model AI
    API-->>UI: Return Balasan Chat AI
    UI-->>P: Tampilkan Balasan di Layar
```

### 2.6 Mengelola Profil (Pasien)
```mermaid
sequenceDiagram
    participant P as Pasien
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    P->>UI: Akses Halaman Profil & Update Data
    UI->>API: PATCH /update-me
    API->>DB: Update Kolom Biodata User (Pasien)
    DB-->>API: Update Berhasil
    API-->>UI: Return Data Profil Terbaru
    UI-->>P: Tampilkan Notifikasi Perubahan Disimpan
```

---

## 3. Dokter

### 3.1 Melihat Jadwal Praktik
```mermaid
sequenceDiagram
    participant D as Dokter
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    D->>UI: Akses Dashboard Dokter
    UI->>API: GET /appointments/my-schedule
    API->>DB: Ambil Jadwal Praktik Spesifik untuk Dokter Ini
    DB-->>API: Data Jadwal
    API-->>UI: Return Data
    UI-->>D: Tampilkan Kalender / List Jadwal Praktik
```

### 3.2 Melihat Data Penyakit Pasien
```mermaid
sequenceDiagram
    participant D as Dokter
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    D->>UI: Pilih Pasien dari Daftar Reservasi
    UI->>API: GET /appointments/my-medical-history
    API->>DB: Ambil Riwayat Rekam Medis & Penyakit Sebelumnya
    DB-->>API: Data Medical Records
    API-->>UI: Return Riwayat Rekam Medis
    UI-->>D: Tampilkan Detail Riwayat Penyakit Pasien
```

### 3.3 Mengisi Rekam Medis & 3.4 Memberikan Diagnosis
```mermaid
sequenceDiagram
    participant D as Dokter
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    D->>UI: Input Anamnesis, Diagnosis, & Tindakan
    UI->>API: POST /medical-records
    API->>DB: Simpan Catatan Rekam Medis (Diagnosis, Resep, dll)
    DB-->>API: Sukses Menyimpan
    API-->>UI: Return Konfirmasi Rekam Medis
    UI->>API: PATCH /appointments/{app_id}/status (Selesai)
    API-->>UI: Status Diperbarui
    UI-->>D: Tampilkan Notifikasi Selesai Pemeriksaan
```

### 3.5 Melihat Reservasi Pasien
```mermaid
sequenceDiagram
    participant D as Dokter
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    D->>UI: Buka Menu Pasien Hari Ini
    UI->>API: GET /appointments/my-patients (atau /my-today)
    API->>DB: Ambil Data Janji Temu untuk Dokter pada Hari Tersebut
    DB-->>API: Daftar Janji Temu (Pasien)
    API-->>UI: Return Data Pasien
    UI-->>D: Tampilkan Tabel Antrian Pasien Dokter
```

### 3.6 Mengelola Profil (Dokter)
```mermaid
sequenceDiagram
    participant D as Dokter
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    D->>UI: Edit Biodata / Spesialisasi
    UI->>API: PATCH /update-me (atau PATCH /doctors/{doc_id})
    API->>DB: Update Profil Dokter di Database
    DB-->>API: Sukses Update
    API-->>UI: Berhasil
    UI-->>D: Notifikasi Profil Diperbarui
```

---

## 4. Admin

### 4.1 Mengelola Data Pasien
```mermaid
sequenceDiagram
    participant Ad as Admin
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    Ad->>UI: Buka Menu Manajemen Pasien
    UI->>API: GET /patients
    API-->>UI: Tampilkan Daftar Pasien
    Ad->>UI: Edit Status / Blokir Pasien
    UI->>API: PATCH /patients/{p_id}
    API->>DB: Update Atribut Pasien
    DB-->>API: Sukses
    API-->>UI: Return Status Terbaru
    UI-->>Ad: Notifikasi Perubahan Berhasil
```

### 4.2 Mengelola Data Dokter & 4.3 Mengelola Jadwal Dokter
```mermaid
sequenceDiagram
    participant Ad as Admin
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    Ad->>UI: Tambah Dokter Baru / Edit Jadwal
    alt Tambah Dokter Baru
        UI->>API: POST /register-staff (Role=Doctor) & POST /doctors
    else Edit Profil / Jadwal Dokter
        UI->>API: PATCH /doctors/{doc_id}
    else Hapus Dokter
        UI->>API: DELETE /doctors/{doc_id}
    end
    API->>DB: Eksekusi Query ke Database
    DB-->>API: Transaksi Berhasil
    API-->>UI: Return Konfirmasi
    UI-->>Ad: Tampilkan Notifikasi Aksi Berhasil
```

### 4.4 Mengelola Reservasi
```mermaid
sequenceDiagram
    participant Ad as Admin
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    Ad->>UI: Buka Semua Daftar Reservasi
    UI->>API: GET /appointments
    API-->>UI: Tampilkan Data Janji Temu Keseluruhan
    Ad->>UI: Ubah Status (Misal: Cancel/Reschedule)
    UI->>API: PATCH /appointments/{appointment_id}/status
    API->>DB: Update Status Janji Temu
    DB-->>API: Sukses
    API-->>UI: Return Sukses
    UI-->>Ad: Status Reservasi Terubah
```

### 4.5 Mengelola Layanan Klinik
```mermaid
sequenceDiagram
    participant Ad as Admin
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    Ad->>UI: Buka Menu Layanan Klinik
    UI->>API: GET /services
    Ad->>UI: Tambah/Ubah Info Layanan (Misal: Harga)
    UI->>API: POST /services atau PATCH /services/{service_id}
    API->>DB: Update Data Layanan Klinik
    DB-->>API: Sukses
    API-->>UI: Return Layanan Terbaru
    UI-->>Ad: Data Layanan Diperbarui
```

### 4.6 Mengelola AI Knowledge
```mermaid
sequenceDiagram
    participant Ad as Admin
    participant UI as Frontend
    participant API as Backend (chatbot.py)
    participant VectorDB as Vector Store / Knowledge Base
    Ad->>UI: Upload Dokumen Pedoman Klinik
    UI->>API: POST /ingest
    API->>VectorDB: Parsing Teks, Generate Embeddings, dan Indexing Data
    VectorDB-->>API: Proses Indexing Berhasil
    API-->>UI: Return Status Ingestion
    UI-->>Ad: Tampilkan Pesan Knowledge AI Berhasil Diperbarui
```

### 4.7 Monitoring Dashboard
```mermaid
sequenceDiagram
    participant Ad as Admin
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    Ad->>UI: Buka Dashboard Admin
    UI->>API: GET /stats/summary & GET /admin/stats
    API->>DB: Kumpulkan Statistik (Total Pasien, Pendapatan, Kunjungan)
    DB-->>API: Data Agregasi
    API-->>UI: Return Data Statistik
    UI-->>Ad: Tampilkan Grafik, Total Reservasi & Monitoring Realtime
```

### 4.8 Verifikasi Administrator & 4.9 Mengelola Pengaturan Sistem
```mermaid
sequenceDiagram
    participant Ad as Admin
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    Ad->>UI: Akses Fitur Khusus / Pengaturan Sistem
    UI->>API: Request API dengan JWT Token (Role: Admin)
    API->>API: Verifikasi Otorisasi via Middleware (Role Check)
    alt Role Valid
        API->>DB: Ambil / Simpan Pengaturan
        DB-->>API: Sukses
        API-->>UI: Return Status Berhasil
        UI-->>Ad: Aksi Diizinkan
    else Tidak Ada Akses
        API-->>UI: 403 Forbidden
        UI-->>Ad: Tampilkan Pesan "Akses Ditolak"
    end
```

---

## 5. Perawat

### 5.1 Melihat Antrian Pasien
```mermaid
sequenceDiagram
    participant Pr as Perawat
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    Pr->>UI: Buka Halaman Monitor Antrian & Dashboard Perawat
    UI->>API: GET /appointments/queue & GET /appointments/nurse-stats
    API->>DB: Ambil Antrian Berjalan untuk Hari Ini
    DB-->>API: Daftar Antrian
    API-->>UI: Return Data Antrian
    UI-->>Pr: Tampilkan Daftar Urutan Pasien (Sesuai Poli/Dokter)
```

### 5.2 Memanggil Pasien & 5.5 Membantu Pelayanan Klinik
```mermaid
sequenceDiagram
    participant Pr as Perawat
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    Pr->>UI: Klik tombol "Panggil / Proses" Pasien
    UI->>API: PATCH /appointments/{appointment_id}/status (Status: "in-progress")
    API->>DB: Update Status Antrian
    DB-->>API: Berhasil Diupdate
    API-->>UI: Return Status Terbaru
    UI-->>Pr: Pasien Ditandai Sedang Dilayani
```

### 5.3 Mengelola Catatan Medis & 5.4 Melihat Data Pasien
```mermaid
sequenceDiagram
    participant Pr as Perawat
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    Pr->>UI: Buka Detail Pasien & Input Pemeriksaan Awal (Tensi, Suhu)
    UI->>API: GET /patients/{id} (Lihat Info)
    API-->>UI: Info Biodata Pasien
    UI->>API: POST /medical-records (Catatan Perawat)
    API->>DB: Simpan Tanda-tanda Vital Pra-Pemeriksaan
    DB-->>API: Sukses
    API-->>UI: Return Data Tersimpan
    UI-->>Pr: Tampilkan Notifikasi Pemeriksaan Awal Disimpan
```

### 5.6 Mengelola Profil (Perawat)
```mermaid
sequenceDiagram
    participant Pr as Perawat
    participant UI as Frontend
    participant API as Backend
    participant DB as Database
    Pr->>UI: Buka Pengaturan Akun
    UI->>API: PATCH /update-me
    API->>DB: Update Data Akun Perawat
    DB-->>API: Sukses
    API-->>UI: Return Profil Terbaru
    UI-->>Pr: Notifikasi Update Profil Berhasil
```
