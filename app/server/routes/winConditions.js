const express = require("express");
const router = express.Router();
const { updateCardBooleanArrays, checkWinConditions } = require('../gameLogic');

module.exports = function(db) {
    //get all win conditions
    router.get('/', (req, res) => {
        console.log("get received by server: winCondition");
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
        console.log("post(add) received by server: winCondition");
        db.run('INSERT INTO win_conditions (condition, is_active) VALUES (?, ?)', [condition, is_active], function(err) {
            if (err) {
                return res.status(500).json({error: err.message });
            }
            //only this card will need to be done, but for now check all
            checkWinConditions(db)
            .then(winFound => {
                //winConditionID = this.lastID; - provided in get
                //respond to the front-end, only needs winFound as front end will trigger rerender on response
                res.json({winFound});
            })
            
        });
    });

    //toggle a win condition active or inactive (needs ID)
    router.post('/toggle/:id', (req, res) => {
        console.log("post(toggle) received by server: winCondition");
        const id = req.params.id;
        db.run('UPDATE win_conditions SET is_active = NOT is_active WHERE id = ?', [id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                //should never happen as the only way to call this will be by clicking a delete icon on a card that has a valid id
                return res.status(404).json({ error: "win condition not found"});
            }
            //only this card will need to be done, and only if being set active, but for now check all
            checkWinConditions(db)
            .then(winFound => {
                //respond to the front-end, returning winFound - which will be the first winning card's id or -1 if no win found
                res.json({winFound: winFound});
            })
            //res.json({ message: "win condition toggled successfully", changes: this.changes});
        });
    });

    //delete a win condition
    router.delete('/:id', (req, res) => {
        console.log("delete received by server: winCondition");
        const id = req.params.id;
        db.run('DELETE FROM win_conditions WHERE id = ?', [id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                //should never happen as the only way to call this will be by clicking a delete icon on a card that has a valid id
                return res.status(404).json({ error: "win condition not found"});
            }
            res.json({ message: "win condition deleted successfully"});
        });
    });

    return router;
}