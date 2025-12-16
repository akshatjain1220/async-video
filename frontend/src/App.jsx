import { useRef, useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:4000/api";

export default function App() {
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("upload"); // upload | tasks

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  // Poll tasks only on tasks page
  useEffect(() => {
    if (page !== "tasks") return;

    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, [page]);

  // Upload video
  const startProcessing = async () => {
    if (!file) {
      alert("Please select a video");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFile(null);
      setPage("tasks"); // 👉 move to tasks page
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inline CSS */}
      <style>{`
        body {
          background: #56a3f1ff;
          font-family: Arial, sans-serif;
        }

        .container {
          max-width: 650px;
          margin: 40px auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        h2 {
          margin-bottom: 20px;
        }

        .upload-box {
          border: 2px dashed #120f0fff;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .hint {
          font-size: 12px;
          color: #0d0b0bff;
        }

        button {
          padding: 10px 20px;
          cursor: pointer;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .task {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          margin-top: 10px;
          border-radius: 4px;
          font-size: 14px;
        }

        .queued {
          background: #623535ff;
        }

        .processing {
          background: #623535ff;
        }

        .completed {
          background: #623535ff;
        }

        .failed {
          background: #623535ff;
        }

        .error {
          color: red;
          font-size: 12px;
        }

        a {
          text-decoration: none;
          color: #1976d2;
          font-weight: bold;
        }

        .back {
          margin-bottom: 20px;
          cursor: pointer;
          color: #1976d2;
        }
      `}</style>

      <div className="container">
        {/* ================= UPLOAD PAGE ================= */}
        {page === "upload" && (
          <>
            <h2>Upload Video</h2>

            <div
              className="upload-box"
              onClick={() => fileRef.current.click()}
            >
              <p>{file ? file.name : "Click to upload video"}</p>
              <p className="hint">MP4, MOV, WebM</p>

              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <button onClick={startProcessing} disabled={loading}>
              {loading ? "Uploading..." : "Start Processing"}
            </button>
          </>
        )}

        {/* ================= TASKS PAGE ================= */}
        {page === "tasks" && (
          <>
            <div className="back" onClick={() => setPage("upload")}>
              ← Upload another video
            </div>

            <h2>Processing Tasks</h2>

            {tasks.length === 0 && <p>No tasks yet</p>}

            {tasks.map((t) => (
              <div
                key={t.id}
                className={`task ${t.state.toLowerCase()}`}
              >
                <div>
                  <strong>Task #{t.id}</strong> — {t.profile} ({t.format})
                  {t.state === "FAILED" && (
                    <div className="error">{t.error}</div>
                  )}
                </div>

                <div>
                  {t.state === "COMPLETED" && (
                    <a href={`${API_BASE}/download/${t.id}`}>
                      Download
                    </a>
                  )}
                  {t.state !== "COMPLETED" && t.state}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
