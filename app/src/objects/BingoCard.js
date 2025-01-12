import './BingoCard.css';

class BingoCard {
    constructor() {
        this.numbers = [
                    [1, 16, 31, 46, 61],
                    [2, 17, 32, 47, 62],
                    [3, 18, 0, 48, 63],
                    [4, 19, 34, 49, 64],
                    [5, 20, 35, 50, 65],
                ];
        this.bools = Array(5).fill(null).map(() => Array(5).fill(false));
        this.bools[2][2] = true;//for the free space
    }

    //set cards numbers to passed in array values
    setCardNumbers(inputArray) {
        if (isValidCard(inputArray))
        {
            this.numbers = inputArray;
            this.bools = Array(5).fill(null).map(() => Array(5).fill(false));
            this.bools[2][2] = true;//for the free space
        }
        function isValidCard(input) {
            return (
                //checks that it is an array
                Array.isArray(input) &&
                //cehcks that there are 5 rows
                input.length === 5 && 
                //checks that every row is an array of length 5
                input.every(row => Array.isArray(row) && row.length === 5)
            );
        };
    }

    //generate default numbers for a bingoCard with the center tile free
    generateCardNumbers() {
        const numbers = Array(5).fill(null).map(() => Array(5).fill(0));
        for (let i = 0; i < 5; i++)
        {
            for (let j = 0; j < 5; j++)
            {
                numbers[j][i] = Math.floor(Math.random() * 15) + 1 + i*15;//i*15 for 1-15 in b, 16-30 in i, etc.
            }   
        }
        numbers[2][2] = "FREE"; //center tile
        return numbers;
    }

    //basically a set function for the boolean array
    markNumber(calledNumber) {
        let found = false;//because the number can only exist once (though the randomized cards allow duplicates)
        for (let i = 0; i < 5; i++) 
        {
            for (let j = 0; j < 5; j++) 
            {
                if (this.numbers[i][j] === calledNumber) 
                {
                    this.bools[i][j] = true;//set the bool to true if it's the called number
                    found = true;
                    break;
                }
            }
            if (found) {break};
        }
    }

    getCardNumbers() {
        return this.numbers;
        /*returns the cards numbers, in format
        [
            [1, 3, 6, 4, 15],
            [16, 22, 29, 28, 19],
            [30, 31, FREE, 44, 42],
            ...
            ...
        ]
        */
    }

    getCardBools() {
        return this.bools;
        /*returns the cards bools, in format 
        [
            [false, false, false, false, false],
            [false, false, false, false, false],
            [false, false, true, false, false],
            [false, false, false, false, false],
            [false, false, false, false, false],
        ]*/
    }
}

export default BingoCard;