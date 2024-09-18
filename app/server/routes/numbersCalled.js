const express = require("express");
const router = express.Router();
const { updateCardBooleanArrays, checkWinConditions } = require('../gameLogic');

module.exports = function(db) {
    //get all numbers
    router.get('/', (req, res) => {
        db.all('SELECT * FROM numbers_called', [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });

    //add new number - update to game state
    router.post('/:num', (req, res) => {
        console.log("post received by server");
        const num = req.params.num;
        db.run('INSERT INTO numbers_called (number) VALUES (?)', [num], function(err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(409).json({ error: "Number already exists"});
                }
                
                console.log("error in post");
                return res.status(500).json({ error: err.message});
            }
            const numberId = this.lastID;//will return id of the num (for deletion buttons to use)
            
            //these functions are/will be implemented in index.js, where this file is exported to
            updateCardBooleanArrays(db)
                .then(() => checkWinConditions(db))//chain the promises
                .then(winFound => {
                    //respond to the front-end, returning the id of the new number (for delete), and winFound - which will be the first winning card's id or -1 if no win found
                    res.json({id: numberId, winFound});
                })
        });
    });

    //delete a number - update to game state, but shouldn't need any other calls since next number added will recheck all cards against the whole list? - maybe
    router.delete('/deleteIndividual/:id', (req, res) => {
        const id = req.params.id;
        db.run('DELETE FROM numbers_called WHERE id = ?', [id], function(err) {
            console.log("delete/:id ru");
            if (err) {
                return res.status(500).json({ error: err.message});
            }
            if (this.changes === 0) {//should never happen, only way to call will be through button press
                return res.status(404).json({error: "Id not found"});
            }
            //update card boolean arrays - rerender, no new wins found
            updateCardBooleanArrays(db);
            res.json({ message: "number deleted successfully"});
        });
    });

    //delete all numbers (new game) - same as above
    router.delete('/deleteAll', (req, res) => {
        db.run('DELETE from numbers_called', [], function(err) {
            if (err) {
                return res.status(500).json({error: err.message});
            }
            //reset card booleans, could be a simpler function for sure
            updateCardBooleanArrays(db);
            res.json({ message: "all numbers deleted successfully"});
        });
    });

    return router;
}