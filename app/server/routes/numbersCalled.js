const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./server/db/bingo.db.sqlite");

//get all numbers
router.get('/', (req, res) => {
    db.all('SELECT * FROM numbers_called', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

//add new number
router.post('/:num', (req, res) => {
    const num = req.params.num;
    db.run('INSERT INTO numbers_called (number) VALUES (?)', [num], function(err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({ error: "Number already exists"});
            }
            return res.status(500).json({ error: err.message});
        }
        res.json({id: this.lastID});//return id of the num, not the num itself
    });
});

//delete a number
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM numbers_called WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message});
        }
        if (this.changes === 0) {//should never happen, only way to call will be through button press
            return res.status(404).json({error: "Id not found"});
        }
        res.json({ message: "number deleted successfully"});
    });
});

//delete all numbers (new game)
router.delete('/deleteAll', (req, res) => {
    db.run('DELETE from numbers_called', [], function(err) {
        if (err) {
            return res.status(500).json({error: err.message});
        }
        res.json({ message: "all numbers deleted successfully"});
    });
});

module.exports = router;