<!--- HEADER BANNER with animated gradient --->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12&height=220&section=header&text=DentalAI%20Systems&fontSize=60&animation=fadeIn&fontAlignY=38" width="100%" />
</p>

<!--- TYPING EFFECT (already animated) --->
<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=30&duration=3000&pause=500&color=FF6D5A&center=true&vCenter=true&width=500&lines=DentAI;AI+Dental+Clinic;n8n+Automation;RAG+Chatbot" alt="Typing SVG" />
</p>

<!--- ANIMATED 3D BOTS (rotating shadows) --->
<div align="center">
  <div style="display: inline-block; animation: float 3s ease-in-out infinite;">
    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=tooth&backgroundColor=FF6D5A&radius=50&scale=90" width="120" />
  </div>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <div style="display: inline-block; animation: float 3s ease-in-out infinite 0.5s;">
    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=n8n&backgroundColor=4A90E2&radius=50&scale=90" width="120" />
  </div>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <div style="display: inline-block; animation: float 3s ease-in-out infinite 1s;">
    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=ai&backgroundColor=764ba2&radius=50&scale=90" width="120" />
  </div>
</div>

<!--- custom CSS for floating animation --->
<style>
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
    100% { transform: translateY(0px); }
  }
</style>

<br />

<!--- ANIMATED STATUS BADGES (pulse effect) --->
<p align="center">
  <img src="https://img.shields.io/badge/Workflow-n8n-FF6D5A?style=for-the-badge&logo=n8n&logoColor=white&labelColor=2d2d2d" />
  &nbsp;
  <img src="https://img.shields.io/badge/Status-Production_Ready-brightgreen?style=for-the-badge&logo=githubactions&logoColor=white&labelColor=2d2d2d" />
  &nbsp;
  <img src="https://img.shields.io/badge/AI-RAG-9b59b6?style=for-the-badge&logo=openai&logoColor=white" />
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=dentalai&label=Views&color=FF6D5A&style=for-the-badge" />
  <img src="https://img.shields.io/github/stars/nauli/dentalai?style=for-the-badge&logo=github" />
</p>

<hr />

## 📖 Overview

**DentalAI Systems** adalah platform manajemen klinik gigi generasi berikutnya yang menggabungkan:

- ✅ **Dashboard Interaktif** untuk pasien, dokter, dan admin
- ✅ **Sistem Antrean Real‑Time** dengan notifikasi WhatsApp otomatis
- ✅ **AI Chatbot Cerdas** berbasis RAG (Retrieval Augmented Generation)
- ✅ **Workflow n8n** untuk automasi janji temu dan pengingat obat

> 💡 Semua data medis dienkripsi penuh dan tersimpan di **Neon Cloud PostgreSQL**.

---

## 🧠 Arsitektur Sistem (Live Workflow)

```mermaid
graph TD
    subgraph Frontend [🖥️ Frontend - Next.js]
        A[User Dashboard] -->|interaksi| B(Next.js App Router)
    end

    subgraph Backend [⚙️ Backend - FastAPI]
        B -->|REST API| C{FastAPI Gateway}
        C -->|CRUD| D[(PostgreSQL / Neon)]
        C -->|autentikasi| E[Auth JWT]
    end

    subgraph Workflow [🤖 Automasi n8n]
        C -->|trigger event| F[n8n Webhook]
        F -->|condition| G{Status Janji}
        G -->|pending| H[WhatsApp Reminder]
        G -->|confirmed| I[Email Invoice]
        G -->|completed| J[Update Rekam Medis]
    end

    subgraph AI [🧠 AI RAG Chatbot]
        F -->|query| K[OpenAI Embeddings]
        K -->|retrieve| L[(Vector DB - Pinecone)]
        L -->|context| M[GPT-4 Response]
        M -->|answer| B
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style C fill:#00d1b2,stroke:#333,stroke-width:2px
    style F fill:#ff6d5a,stroke:#333,stroke-width:2px
    style H fill:#25D366,stroke:#333,stroke-width:2px
    style M fill:#9b59b6,stroke:#333,stroke-width:2px