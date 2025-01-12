import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import './NumbersCalled.css';

/*
    - Future Options
        - voice call numbers?
*/
const NumbersCalledComponent = forwardRef((props, ref) => {
    const [allNumbers, setAllNumbers] = useState([]);

    //fetch all numbers when component mounts
    useEffect(() => {
        fetchNumbers();
    }, []);

    //expose refresh method to parent
    useImperativeHandle(ref, () => ({
        refreshNumbers() {
            fetchNumbers();
        }
    }))

    const fetchNumbers = () => {
        axios.get('/api/numbers-called/')
        .then(response => {
            const sortedNumbers = [...response.data].sort((a, b) => b.id - a.id);
            setAllNumbers(sortedNumbers);
        })
        .catch(error => console.error("Error fetching called numbers - NumbersCalledComponent", error));
    }

    /*
    function deleteNumber(numberId) {
        /* Optimistic deletion option for responsiveness
        ****DOESN'T HELP - backend operations are what takes time here and app.js doesn't refresh until db has responded
            - but could do with extra prop/ref functions. This seems much messier though
        const updatedNumbers = allNumbers.filter(number => number.id !== numberId);
        setAllNumbers(updatedNumbers);
        //* /
        axios.delete(`/api/numbers-called/deleteIndividual/${numberId}`)
        .then(response => {
            console.log(`Deleted number with id ${numberId}`);
            fetchNumbers();//refresh the list after deletion
            props.fetchRecentNumbers();//trigger refresh for recent numbers in app.js
        })
        .catch(error => console.error(`Error deleting number ${numberId} - NumbersCalledComponent `, error));
        //optimistic delete option, shouldn't be necessary with fixed delete button structure
        //setAllNumbers(prevNumbers => [...prevNumbers], {id: numberId, number: numberId/* This has to be wrong, but I don't think the actual number was passed anywhere * /})
    };*/

    function deleteAllNumbers() {
        axios.delete('/api/numbers-called/deleteAll')
        .then(response => {
            console.log('Deleted all numbers');
            fetchNumbers();
            props.fetchRecentNumbers();//trigger refresh for recent numbers in app.js
        })
        .catch(error => console.error('Error deleting all numbers - numbersCalledComponent', error));
    };

    const getBingoNumber = (letter, rowIndex) => {
        switch (letter) {
          case 'B': return rowIndex + 1;
          case 'I': return rowIndex + 16;
          case 'N': return rowIndex + 31;
          case 'G': return rowIndex + 46;
          case 'O': return rowIndex + 61;
          default: return null;
        }
    };

    function addNumber(number) {
        axios.post(`/api/numbers-called/${number}`)
            .then(response => {
                console.log('Number called: ', response.data);
                //update list of called numbers
                props.fetchRecentNumbers();
                fetchNumbers();
            })
            .catch(error => {
                if (error.response && error.response.status == 409) {
                    alert(`${error.response.data.num} already called`);
                }
                console.error("error calling number - app.js: ", error)
            });
    }

    function deleteNumberByValue(number) {
        axios.delete(`/api/numbers-called/deleteByValue/${number}`)
        .then(response => {
            console.log(`Deleted ${number}`);
            fetchNumbers();//refresh the list after deletion
            props.fetchRecentNumbers();//trigger refresh for recent numbers in app.js
        })
        .catch(error => console.error(`Error deleting ${number} - NumbersCalledComponent `, error));
    };

    return (
        <div className="numbers-called-component">
            <table className="bingo-card">
            <tbody>
                <tr>
                    <td>B</td>
                    <td>I</td>
                    <td>N</td>
                    <td>G</td>
                    <td>O</td>
                </tr>
                {Array.from({ length: 15 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                    {['B', 'I', 'N', 'G', 'O'].map((letter, colIndex) => {
                    // Calculate the number for each cell based on the row and column
                    const number = getBingoNumber(letter, rowIndex);
                    const isCalled = allNumbers.some(item => item.number === number); // Check if the number has been called

                    return (
                        <td key={colIndex}>
                        {// Render Add or Delete button depending on whether the number exists
                        }
                        {!isCalled ? (
                            <button
                                className="bingo-button add"
                                onClick={() => addNumber(number)} // Call addNumber when clicked
                            >
                                {number}
                            </button>
                        ) : (
                            <button
                                className="bingo-button delete"
                                onClick={() => deleteNumberByValue(number)} // Call deleteNumber when clicked
                            >
                                {number}
                            </button>
                        )}
                        </td>
                    );
                    })}
                </tr>
                ))}
            </tbody>
            </table>
            {/* Delete all numbers button */}
            {allNumbers.length > 0 ? (
                <div className='clear-button-container'>
                    <button onClick={deleteAllNumbers} className='delete-all-button'>
                        Clear
                    </button>
                </div>
            ) : (null)}
        </div>
    );
});

export default NumbersCalledComponent;