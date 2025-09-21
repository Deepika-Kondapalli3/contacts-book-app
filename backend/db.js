 
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'contacts.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('Failed to open DB:', err.message);
  console.log('Connected to SQLite DB at', dbPath);
});

// Initialize table
const init = () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.run(createTableSQL, (err) => {
    if (err) console.error('Failed to create contacts table:', err.message);
  });
};

init();

module.exports = db;
