# 🎬 Video Forge – Asynchronous Video Processing System

## 📌 Overview
Video Forge is an asynchronous video processing system that allows users to upload videos, process them in the background, and download the transformed output once processing is complete.

The system is designed to demonstrate real-world backend architecture using task queues, background workers, and persistent task state management. Video processing is handled asynchronously using FFmpeg to ensure non-blocking, scalable performance.

---

## ✨ Features
- Upload videos through a web interface
- Asynchronous background video processing
- Task queue with persistent states
- FFmpeg-based video transformation
- Real-time task status tracking
- Download processed videos
- Clear separation of frontend, backend, and worker services

---

## 🔁 Task Lifecycle
Each video processing job follows a defined lifecycle:

- **QUEUED** – Task is waiting to be processed
- **PROCESSING** – Task is currently being handled by the worker
- **COMPLETED** – Video processing finished successfully
- **FAILED** – An error occurred during processing

---

## 🏗️ System Architecture

- **Frontend:** React (Vite)
- **Backend API:** Node.js + Express
- **Background Worker:** Node.js
- **Database:** PostgreSQL
- **Video Processing Engine:** FFmpeg

The backend API handles uploads and task creation, while a separate worker process polls the database and processes queued tasks asynchronously.

---

## ▶️ How It Works

1. User uploads a video from the frontend.
2. Backend saves the file and creates a processing task in PostgreSQL.
3. A background worker continuously polls for queued tasks.
4. FFmpeg processes the video in the background.
5. Task state is updated in the database.
6. User can download the processed video once the task is completed.

---

## 🚀 Running the Project

### Prerequisites
- Node.js
- PostgreSQL
- FFmpeg (must be added to system PATH)

---

### Backend
```bash
cd backend
npm install
node server.js
