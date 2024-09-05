const express = require("express");
const router = express.Router();

module.exports = function(db) {
    //get all win conditions
    router.get('/', (req, res) => {
        db.all('SELECT * FROM win_conditions', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });

    //add a new win condition
    router.post('/add', (req, res) => {
        const { condition, is_active } = req.body;
        db.run('INSERT INTO win_conditions (condition, is_active) VALUES (?, ?)', [condition, is_active], function(err) {
            if (err) {
                return res.status(500).json({error: err.message });
            }
            res.json({ id: this.lastID });//return unique id of the inserted win condition
        });
    });

    //toggle a win condition active or inactive (needs ID)
    router.post('/toggle/:id', (req, res) => {
        const id = req.params.id;
        db.run('UPDATE win_conditions SET is_active = NOT is_active WHERE id = ?', [id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                //should never happen as the only way to call this will be by clicking a delete icon on a card that has a valid id
                return res.status(404).json({ error: "win condition not found"});
            }
            res.json({ message: "win condition toggled successfully", changes: this.changes});
        });
    });

    //delete a win condition
    router.delete('/:id', (req, res) => {
        const id = req.params.id;
        db.run('DELETE FROM win_conditions WHERE id = ?', [id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                //should never happen as the only way to call this will be by clicking a delete icon on a card that has a valid id
                return res.status(404).json({ error: "win condition not found"});
            }
            res.json({ message: "win condition deleted successfully", changes: this.changes});
        });
    });

    return router;
}