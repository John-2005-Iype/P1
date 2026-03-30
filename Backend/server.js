const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

// 🔁 Retry DB connection
const connectWithRetry = async () => {
  while (true) {
    try {
      await pool.query("SELECT 1");
      console.log("✅ Connected to PostgreSQL");
      break;
    } catch (err) {
      console.log("⏳ Waiting for DB...");
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

// Routes
app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/notes", async (req, res) => {
  const { student_name, content } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO notes (student_name, content) VALUES ($1, $2) RETURNING *",
      [student_name, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM notes WHERE id = $1", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server AFTER DB is ready
const startServer = async () => {
  await connectWithRetry();

  app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
  });
};

startServer();