const express = require("express");
const router = express.Router();
const { updateCardBooleanArrays, checkWinConditions } = require('../gameLogic');

module.exports = function(db) {
    //get all numbers
    router.get('/', (req, res) => {
        db.all('SELECT * FROM numbers_called', [], (err, rows) => {
            console.log("get received by server: numbersCalled");
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });

    //add new number - update to game state
    router.post('/:num', (req, res) => {
        const num = req.params.num;
        console.log("post received by server, number: " + num);
        db.run('INSERT INTO numbers_called (number) VALUES (?)', [num], function(err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(409).json({
                        error: "Number already exists",
                        num: num
                        });
                }
                console.log("error in post");
                return res.status(500).json({ error: err.message});
            }
            const numberId = this.lastID;
            
            updateCardBooleanArrays(db)
                .then(() => checkWinConditions(db))
                .then(winFound => {
                    console.log(winFound + "win found in numbersCalled.js")
                    res.json({id: numberId, winFound});
                    //also return the winCondition id for highlighting?
                })
                .catch(err => {
                    console.error("Error during updateCardBooleanArrays or checkWinConditions: ", err);
                    res.status(500).json({error: "Internal server error during processing gameLogic - numbersCalledRoutes" });
                })
        });
    });

    //delete a number - update to game state, but shouldn't need any other calls since next number added will recheck all cards against the whole list? - maybe
    router.delete('/deleteIndividual/:id', (req, res) => {
        const id = req.params.id;
        db.run('DELETE FROM numbers_called WHERE id = ?', [id], function(err) {
            console.log("delete received by server: numberCalled id: " + id);
            if (err) {
                return res.status(500).json({ error: err.message});
            }
            if (this.changes === 0) {
                return res.status(404).json({error: "Id not found"});
            }
            //update card boolean arrays - rerender, no new wins found
            updateCardBooleanArrays(db);
            res.json({ message: "number deleted successfully"});
        });
    });

    //delete a number by value, different implementation
    router.delete('/deleteByValue/:value', (req, res) => {
        const num = req.params.value;
        db.run('DELETE FROM numbers_called WHERE number = ?', [num], function(err) {
            console.log("delete received by server: numberCalled num: " + num);
            if (err) {
                return res.status(500).json({ error: err.message});
            }
            if (this.changes === 0) {
                return res.status(404).json({error: "Value not found"});
            }
            //update card boolean arrays - rerender, no new wins found
            updateCardBooleanArrays(db);
            res.json({ message: num + " deleted successfully"});
        });
    });

    //delete all numbers (new game) - same as above
    router.delete('/deleteAll', (req, res) => {
        db.run('DELETE from numbers_called', [], function(err) {
            console.log("delete all received by server - numbersCalled")
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