function updateCardBooleanArrays(db) {
    return new Promise((resolve, reject) => {
        //update the boolean arrays of each card
        console.log("updating card boolean arrays - not implemented");
        //perform necessary operations

        //use another db.run, not a call to post, as that will create an infinite loop

        resolve();
    });
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