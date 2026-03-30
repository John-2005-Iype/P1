CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    student_name TEXT NOT NULL,
    content TEXT NOT NULL, -- Changed from note_content to content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);