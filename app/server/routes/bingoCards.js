const express = require("express");
const router = express.Router();
const { updateCardBooleanArrays, checkWinConditions } = require('../gameLogic');

module.exports = function(db) {
    //get all cards
    router.get('/', (req, res) => {
        console.log("get received by server: bingoCard");
        db.all('SELECT * FROM bingo_cards', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message});
            }
            res.json(rows);
        });
    });

    //add new card (takes 25 numbers (and free), and activity status (on by default))
    router.post('/', (req, res) => {
        console.log("post received by server: bingoCard");
        const {card, is_active} = req.body;
        db.run("INSERT INTO bingo_cards (card, is_active) VALUES (?, ?)", [card, is_active], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message});
            } 
            //only really need to update this one cards bools and check it, but for now do all
            updateCardBooleanArrays(db)
            .then(() => checkWinConditions(db))
            .then(winFound => {
                //return the id of the new card, and the winFound number (the winning card's index or -1)
                res.json({winFound: winFound}); 
            });
        });
    });

    //toggle card
    router.post('/toggle/:id', (req, res) => {
        console.log("toggle received by server: bingoCard");
        const id = req.params.id;
        db.run("UPDATE bingo_cards SET is_active = NOT is_active WHERE id = ?", [id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                //should never happen as the only way to call this will be by clicking a delete icon on a card that has a valid id
                return res.status(404).json({ error: "win condition not found"});
            }
            //only really need to check this card, and only when it's toggled active - future modification
            //can do with something like const id = this.lastID
            updateCardBooleanArrays(db)
            .then(() => checkWinConditions(db))
            .then(winFound => {
                //return the winFound number (the winning card's index or -1)
                res.json({id: id, winFound});
            });
        })
    })

    //delete single card
    router.delete('/deleteOne/:id', (req, res) => {
        console.log("deleteOne received by server: bingoCard");
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
    router.delete('/deleteAll', (req, res) => {
        console.log("delete All received by server: bingoCard");
        db.run("DELETE FROM bingo_cards", [], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message});
            }
            res.json({message: "all bingo cards deleted successfully"})
        });
    });

    return router;
}