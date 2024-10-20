/**
Potential Future Refactors: 
- optimize updating the db tables in updateCardBooleanArrays with batch operations
- DUPLICATE the functions and chain them together for 
    new number -> update bools -> check win conditions
  workflow. The separate functions still are necessary
- Remove the explicit promises in dbAll by binding promisify to the call itself
    const util = require('util');
    const dbAll = util.promisify(db.all).bind(db);
    ...
    const cardRows = await dbAll('SELECT * FROM bingo_cards WHERE is_active = 1');
- Implement single modifier functions to save computational complexity of rechecking unchanged cards, etc.
*/
async function updateCardBooleanArrays(db) {
    try {
        const calledNumbersRows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM numbers_called', [], (err, rows) => {
                if (err) { return reject(err); }
                resolve(rows);
            });
        });

        //extract called numbers from each db row
        const calledNumbers = calledNumbersRows.map(row => row.numbers);

        //get all active bingo cards using another promise
        const cardRows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM bingo_cards WHERE is_active = 1', [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        //update boolean arrays and send back to db
        const updatePromises = cardRows.map(card => {
            return new Promise((resolveUpdate, rejectUpdate) => {
                //extract card data = {numbers: [...], bools:[...]}
                const cardData = JSON.parse(card.card);
                //update bool array
                cardData.bools = updateBoolArray(cardData.numbers, calledNumbers);

                //update db
                db.run('UPDATE bingo_cards SET card ? WHERE id = ?', 
                    [JSON.stringify(cardData), card.id],
                    (err) => { 
                        if (err) { 
                            console.log(`Error updating card ${card.id}:`, err.message);
                            rejectUpdate(err);//reject the promise if update fails
                        }
                        else {
                            resolveUpdate();
                        }
                    }
                );
            });//end return promise
        });

        //wait for all updates to complete
        await Promise.all(updatePromises);

        //resolve if all updates are successful
        return;
    }
    catch (error) {
        console.error('Error updating card boolean arrays:', error);
        throw error;//use throw instead of reject in async function
    }
}

function updateBoolArray(cardNumbers, calledNumbers) {
    return cardNumbers.map((number, index) => {
        if (index == 12)//free square
        {
            return true;
        }
        return calledNumbers.includes(number);//check for called status
    });
    //creates an array of the same length as cardNumbers (25), then populates
    //it with true/false values depending on if the number exists in calledNumbers
}

function checkWinConditions(db) {
    return new Promise((resolve, reject) => {
        console.log("checking win conditions - not implemented");
        const winFound = -1;
        //implement necessary operations
        resolve(winFound);
    });
}
module.exports = {updateCardBooleanArrays, checkWinConditions};