const express = require('express');
const router = express.Router();
const db = require('../db');

// validation helpers
const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\d{10}$/;

function validateContact({ name, email, phone }) {
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (!email || !emailRegex.test(email)) {
    return 'Invalid email format';
  }
  if (!phone || !phoneRegex.test(phone)) {
    return 'Phone must be 10 digits';
  }
  return null;
}

// POST /contacts
router.post('/', (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const errMsg = validateContact({ name, email, phone });
    if (errMsg) return res.status(400).json({ error: errMsg });

    const sql = `INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)`;
    db.run(sql, [name.trim(), email.trim(), phone.trim()], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB insert failed' });
      }
      const insertedId = this.lastID;
      const getSql = `SELECT id, name, email, phone, created_at FROM contacts WHERE id = ?`;
      db.get(getSql, [insertedId], (err2, row) => {
        if (err2) return res.status(500).json({ error: 'DB retrieval failed' });
        res.status(201).json({ contact: row });
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /contacts?page=1&limit=10
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const offset = (Math.max(page, 1) - 1) * Math.max(limit, 1);

    const countSql = `SELECT COUNT(*) as total FROM contacts`;
    db.get(countSql, [], (err, row) => {
      if (err) return res.status(500).json({ error: 'DB count failed' });
      const total = row.total || 0;

      const sql = `SELECT id, name, email, phone, created_at FROM contacts
                   ORDER BY created_at DESC
                   LIMIT ? OFFSET ?`;
      db.all(sql, [limit, offset], (err2, rows) => {
        if (err2) return res.status(500).json({ error: 'DB select failed' });
        res.json({
          contacts: rows,
          total,
          page,
          limit
        });
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /contacts/:id
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const sql = `DELETE FROM contacts WHERE id = ?`;
    db.run(sql, [id], function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB delete failed' });
      }
      if (this.changes === 0) return res.status(404).json({ error: 'Contact not found' });
      res.status(204).end();
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
 
