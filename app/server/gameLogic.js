/**
Was thinking of combining these into one function, since I thought 
updating card boolean arrays will always require a winCondition check.
However, update card boolean arrays will also need to be called when a 
calledNumber is deleted (after improper input), so it is best to keep them
modular.
Additionally, there are many sub-functions I could create for updating a 
single card, checking all cards against a single win condition, etc. for 
this, there would be a lot of passing parameters if I wanted to keep the
db calls minimum, but that would also introduce many possible error points
and make the code more difficult to read/maintain, so we'll save it for a 
(potential) future refactor, if needed - though that seems unlikely
 
Potential Future Refactors: 
- optimize updating the db tables in updateCardBooleanArrays with batch operations
*/
function updateCardBooleanArrays(db) {
    return new Promise((resolve, reject) => {
        //update the boolean arrays of each card
        console.log("updating card boolean arrays - not implemented");

        //get all called numbers then active cards
        db.all('SELECT * FROM numbers_called', [], (err, calledNumbersRows) => {
            if (err) {return reject(err); }

            //get the number from each row of the database
            const calledNumbers = calledNumbersRows.map(row => row.numbers);

            db.all('SELECT * FROM bingo_cards WHERE is_active = 1', [], (err, cardRows) => {
                if (err) { return reject(err); }

                //cardRows is each full card (text) field from db
                cardRows.foreach(card => {
                    //extract card data = {numbers: [...], bools:[...]}
                    const cardData = JSON.parse(card.card);
                    //update bool array
                    cardData.bools = updateBoolArray(cardData.numbers, calledNumbers);

                    //update db
                    db.run('UPDATE bingo_cards SET card ? WHERE id = ?', 
                        [JSON.stringify(cardData, card.id)],
                        (err) => { if (err) { console.log(`Error updating card ${card.id}:`, err.message)}}
                    );

                });//end cardRows.foreach
            })//end db.all(cards)
        })//end db.all(numbers)


        
        //use another db.run, not a call to post, as that will create an infinite loop

        resolve();
    });
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