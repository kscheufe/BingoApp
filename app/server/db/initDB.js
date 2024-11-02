const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//path to bingo.db file
const dbPath = path.resolve(__dirname, 'bingo.db.sqlite');

//bingo.db file will be created automatically if not already there
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to db: ", err);
    }
    else 
    {
        console.log("conected to db - initialization script");
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS win_conditions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        condition TEXT UNIQUE,
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
    )`);//card TEXT includes both the numbers and the booleans for the card
    //look into existing code more, but could be implemented as 1d array of objects with number field and boolean field each
});

db.close();