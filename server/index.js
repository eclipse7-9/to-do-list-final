require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MySQL pool - configure via env vars
const poolConfig = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'todo_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;
async function getPool() {
  if (!pool) pool = await mysql.createPool(poolConfig);
  return pool;
}

function rowToTask(row) {
  return {
    id: row.id,
    title: row.title,
    completed: !!row.completed,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

// List tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const p = await getPool();
    const [rows] = await p.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(rows.map(rowToTask));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title required' });
    const p = await getPool();
    const [result] = await p.query('INSERT INTO tasks (title) VALUES (?)', [title.trim()]);
    const insertId = result.insertId;
    const [rows] = await p.query('SELECT * FROM tasks WHERE id = ?', [insertId]);
    res.status(201).json(rowToTask(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const { title, completed } = req.body;
    const parts = [];
    const values = [];
    if (typeof title === 'string') { parts.push('title = ?'); values.push(title.trim()); }
    if (typeof completed === 'boolean') { parts.push('completed = ?'); values.push(completed ? 1 : 0); }
    if (parts.length === 0) return res.status(400).json({ error: 'Nothing to update' });
    values.push(id);
    const p = await getPool();
    const sql = `UPDATE tasks SET ${parts.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await p.query(sql, values);
    const [rows] = await p.query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rowToTask(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const p = await getPool();
    const [result] = await p.query('DELETE FROM tasks WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Todo server listening on http://localhost:${PORT}`);
});
