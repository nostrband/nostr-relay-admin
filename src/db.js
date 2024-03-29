import sqlite3 from "sqlite3";

const db = new sqlite3.Database("rules_db");
function createTables() {
  const rulesTableSql = `
    CREATE TABLE IF NOT EXISTS rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      relays TEXT,
      filter TEXT
    )
  `;

  const relaysTableSql = `
    CREATE TABLE IF NOT EXISTS relays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      relay_array TEXT DEFAULT '[]'
    )
  `;

  const tasksTableSql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eventId TEXT,
      status TEXT
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
      db.run(tasksTableSql, (err) => {
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
  const { name, type, relays, filter } = rule;
  const sql =
    "INSERT INTO rules (name, type, relays, filter) VALUES (?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [name, type, JSON.stringify(relays), JSON.stringify(filter)],
      function (err) {
        if (err) reject(err);
        resolve({ id: this.lastID, name, type, relays, filter });
      },
    );
  });
}
function updateRule(id, updatedRule) {
  const { name, type, relays, filter } = updatedRule;
  const sql =
    "UPDATE rules SET name = ?, type = ?, relays = ?, filter = ? WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [name, type, JSON.stringify(relays), JSON.stringify(filter), id],
      function (err) {
        if (err) reject(err);
        resolve({ id, name, type, relays, filter });
      },
    );
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

function createTask(eventId, status) {
  const sql = "INSERT INTO tasks (eventId, status) VALUES (?, ?)";
  return new Promise((resolve, reject) => {
    db.run(sql, [eventId, status], function (err) {
      if (err) reject(err);
      resolve({ id: this.lastID, eventId, status });
    });
  });
}

function getTasksByEventIds(eventIds) {
  const placeholders = eventIds.map(() => "?").join(",");
  const sql = `SELECT * FROM tasks WHERE eventId IN (${placeholders})`;
  return new Promise((resolve, reject) => {
    db.all(sql, eventIds, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}

async function updateTaskStatus(eventId, status) {
  const sql = "UPDATE tasks SET status = ? WHERE eventId = ?";
  return new Promise((resolve, reject) => {
    db.run(sql, [status, eventId], function (err) {
      if (err) reject(err);
      resolve({ eventId, status });
    });
  });
}

function deleteTaskByEventId(eventId) {
  const sql = "DELETE FROM tasks WHERE eventId = ?";
  return new Promise((resolve, reject) => {
    db.run(sql, [eventId], function (err) {
      if (err) reject(err);
      resolve(this.changes > 0);
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
  createTask,
  updateTaskStatus,
  getTasksByEventIds,
  deleteTaskByEventId,
};
