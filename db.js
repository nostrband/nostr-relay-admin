import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('rules_db');
function createTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      filter TEXT
    )
  `;
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}
function getAllRules() {
  const sql = 'SELECT * FROM rules';
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}
function getRuleById(id) {
  const sql = 'SELECT * FROM rules WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
}
function createRule(rule) {
  const { name, type, filter } = rule;
  const sql = 'INSERT INTO rules (name, type, filter) VALUES (?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.run(sql, [name, type, JSON.stringify(filter)], function (err) {
      if (err) reject(err);
      resolve({ id: this.lastID, name, type, filter });
    });
  });
}
function updateRule(id, updatedRule) {
  const { name, type, filter } = updatedRule;
  const sql = 'UPDATE rules SET name = ?, type = ?, filter = ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.run(sql, [name, type, JSON.stringify(filter), id], function (err) {
      if (err) reject(err);
      resolve({ id, name, type, filter });
    });
  });
}
function deleteRule(id) {
  const sql = 'DELETE FROM rules WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.run(sql, [id], function (err) {
      if (err) reject(err);
      resolve(this.changes > 0);
    });
  });
}
(async () => {
  await createTable();
})();

export { createTable, getAllRules, getRuleById, createRule, updateRule, deleteRule };

