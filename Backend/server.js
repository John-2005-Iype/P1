const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET notes
app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST note ✅ FIXED
app.post("/notes", async (req, res) => {
  console.log("BODY:", req.body);

  const student_name = req.body.student_name || req.body.name;
  const content = req.body.content;

  try {
    const result = await pool.query(
      "INSERT INTO notes (student_name, content) VALUES ($1, $2) RETURNING *",
      [student_name, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
