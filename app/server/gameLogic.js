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

        console.log("Called numbers: " + calledNumbers + " end");
        if (calledNumbers == null) return;

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
                console.log(cardData.numbers)
                //update bool array
                cardData.bools = updateBoolArray(cardData.numbers, calledNumbers);

                //update db
                db.run('UPDATE bingo_cards SET card = ? WHERE id = ?', 
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
    return cardNumbers.map((row, rowIndex) =>
        row.map((number, colIndex) => {
            if (rowIndex == 2 && colIndex == 2)//check free square
            { return true; }
            return calledNumbers.includes(number);//check Called status
        })
    );
    //creates an array of the same length as cardNumbers (25), then populates
    //it with true/false values depending on if the number exists in calledNumbers
}

async function checkWinConditions(db) {//returns -1 or id of winning card
    try {
        //get winConditions from db
        const winConditionsRows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM win_conditions WHERE is_active = 1', [], (err, winConditionsRows) => {
                if (err) { return reject(err); }
                resolve(winConditionsRows);
            });
        });

        //extract win conditions to backend format
        const winConditions = winConditionsRows.map(row => JSON.parse(row.condition));
        
        //fetch all bingo cards
        const bingoCardsRows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM bingo_cards WHERE is_active = 1', [], (err, rows) => {
                if (err) { return reject(err); }
                resolve(rows);
            });
        });

        //check each card against each win condition
        for (const card of bingoCardsRows) {
            const bools = JSON.parse(card.card).bools;

            for (const winCondition of winConditions) {
                if (checkWin(bools, winCondition)) {
                    return card.id;//return winning card id immediately
                }
            }
        }
        //if no win is found, return -1
        return -1;
    }
    catch (error) {
        console.error('Error checking win conditions: ', error);
        throw error; //rethrow the error
    }
}

//returns true if cardBools && winConditionBools == winConditionBools
//converted to binary numbers for efficiency and coolness
function checkWin(cardBools, winConditionBools)
{
    //syntax: accumulator, currBool, index
    //logic: for each element, evaluate currBool (0 or 1), shift it i bits left, and add to accumulator
    const cardBinary = cardBools.reduce((acc, bool, i) => acc | (bool << i), 0);
    const winConditionBinary = winConditionBools.reduce((acc, bool, i) => acc | (bool << i), 0);

    //use bitwise checking for fun
    return (cardBinary & winConditionBinary) === winConditionBinary;
}


module.exports = {updateCardBooleanArrays, checkWinConditions};