const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { videoId } = req.query;

    let query = `
      SELECT id, video_id, format, profile, state, output_path, error, created_at
      FROM tasks
    `;
    const params = [];

    if (videoId) {
      const parsedVideoId = Number(videoId);
      if (Number.isNaN(parsedVideoId)) {
        return res.status(400).json({ error: "Invalid videoId" });
      }

      query += " WHERE video_id = $1";
      params.push(parsedVideoId);
    }

    query += " ORDER BY created_at DESC";

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Fetch tasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

module.exports = router;
