const sqlite3 = require('sqlite3').verbose();

//bingo.db file will be created automatically if not already there
const db = new sqlite3.Database('./server/db/bingo.db', (err) => {
    if (err) {
        console.error("Error connecting to db: ", err);
    }
    else 
    {
        console.log("conected to db");
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS win_conditions {
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        condition TEXT,
        is_active BOOLEAN DEFAULT 0
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS numbers_called (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        number INTEGER NOT NULL UNIQUE
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS bingo_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        card TEXT,
        is_active BOOLEAN DEFAULT 1
    )`);
});

db.close();