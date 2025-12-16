const express = require("express");
const multer = require("multer");
const pool = require("../db");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files allowed"));
    }
    cb(null, true);
  },
});

router.post("/", upload.single("video"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Insert video
    const videoResult = await pool.query(
      `INSERT INTO videos (original_path)
       VALUES ($1)
       RETURNING id`,
      [file.path]
    );

    const videoId = videoResult.rows[0].id;

    // Create processing task
    const taskResult = await pool.query(
      `INSERT INTO tasks (video_id, format, profile, state)
       VALUES ($1, $2, $3, 'QUEUED')
       RETURNING id`,
      [videoId, "mp4", "480p"]
    );

    res.json({
      success: true,
      videoId,
      taskId: taskResult.rows[0].id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
