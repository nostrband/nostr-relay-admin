import sqlite3 from "sqlite3";

const db = new sqlite3.Database("rules_db");
function createTables() {
  const rulesTableSql = `
    CREATE TABLE IF NOT EXISTS rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      filter TEXT
    )
  `;

  const relaysTableSql = `
    CREATE TABLE IF NOT EXISTS relays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      relay_array TEXT DEFAULT '[]'
    )
  `;

  return Promise.all([
    new Promise((resolve, reject) => {
      db.run(rulesTableSql, (err) => {
        if (err) reject(err);
        resolve();
      });
    }),
    new Promise((resolve, reject) => {
      db.run(relaysTableSql, (err) => {
        if (err) reject(err);
        resolve();
      });
    }),
  ]);
}
function getAllRules() {
  const sql = "SELECT * FROM rules";
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}
function getRuleById(id) {
  const sql = "SELECT * FROM rules WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
}
function createRule(rule) {
  const { name, type, filter } = rule;
  const sql = "INSERT INTO rules (name, type, filter) VALUES (?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.run(sql, [name, type, JSON.stringify(filter)], function (err) {
      if (err) reject(err);
      resolve({ id: this.lastID, name, type, filter });
    });
  });
}
function updateRule(id, updatedRule) {
  const { name, type, filter } = updatedRule;
  const sql = "UPDATE rules SET name = ?, type = ?, filter = ? WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.run(sql, [name, type, JSON.stringify(filter), id], function (err) {
      if (err) reject(err);
      resolve({ id, name, type, filter });
    });
  });
}
function deleteRule(id) {
  const sql = "DELETE FROM rules WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.run(sql, [id], function (err) {
      if (err) reject(err);
      resolve(this.changes > 0);
    });
  });
}
function updateRelays(relayArray) {
  const sql = "INSERT OR REPLACE INTO relays (id, relay_array) VALUES (1, ?)";
  return new Promise((resolve, reject) => {
    db.run(sql, [JSON.stringify(relayArray)], function (err) {
      if (err) reject(err);
      resolve({ relay_array: relayArray });
    });
  });
}

function getRelays() {
  const sql = "SELECT relay_array FROM relays WHERE id = 1";
  return new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) reject(err);
      resolve(row ? JSON.parse(row.relay_array) : []);
    });
  });
}
(async () => {
  await createTables();
})();

export {
  createTables,
  getAllRules,
  getRuleById,
  createRule,
  updateRule,
  deleteRule,
  getRelays,
  updateRelays,
};
