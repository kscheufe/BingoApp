const express = require("express");
const router = express.Router();
const { updateCardBooleanArrays, checkWinConditions } = require('../gameLogic');


module.exports = function(db) {
    //get all cards
    router.get('/', (req, res) => {
        db.all('SELECT * FROM bingo_cards', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message});
            }
            res.json(rows);
        });
    });

    //add new card (takes 25 numbers (and free), and activity status (on by default))
    //could better take an array of 25 objects, each containing {number:, boolean:}, and activity status
    //though then the binary AND wouldn't work as easily
    router.post('/', (req, res) => {
        const {card, is_active} = req.body;
        db.run("INSERT INTO bingo_cards (card, is_active) VALUES (?, ?)", [card, is_active], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message});
            } 
            //only really need to update this one cards bools and check it, but for now do all
            updateCardBooleanArrays(db)
            .then(checkWinConditions(db))
            .then(winFound => {
                //return the id of the new card, and the winFound number (the winning card's index or -1)
                res.json({id: this.lastID, winFound});
            });
            //res.json({ id: this.lastID});//return id of the new card
        });
    });

    //edit card? - maybe, seems redundant with the camera/ml. probably handle editing in backend, before api call

    //delete single card
    router.delete('/:id', (req, res) => {
        const id = req.params.id;
        db.run("DELETE FROM bingo_cards WHERE id = ?", [id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message});
            }
            if (this.changes === 0) {
                return res.status(404).json({error: "bingo card not found"});
            }
            res.json({message: "bingo card deleted successfully"})
        });
    });

    //delete all cards
    router.delete('/', (req, res) => {
        db.run("DELETE FROM bingo_cards", [], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message});
            }
            res.json({message: "all bingo cards deleted successfully"})
        });
    });

    return router;
}