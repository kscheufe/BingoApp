import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

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
            setAllNumbers(sortedNumbers);//store complete list
        })
        .catch(error => console.error("Error fetching called numbers - NumbersCalledComponent", error));
    }

    function deleteNumber(numberId) {

        /* Optimistic deletion option for responsiveness
        ****DOESN'T HELP - backend operations are what takes time here and app.js doesn't refresh until db has responded
            - but could do with extra prop/ref functions. This seems much messier though
        const updatedNumbers = allNumbers.filter(number => number.id !== numberId);
        setAllNumbers(updatedNumbers);
        //*/
        axios.delete(`/api/numbers-called/deleteIndividual/${numberId}`)
        .then(response => {
            console.log(`Deleted number with id ${numberId}`);
            fetchNumbers();//refresh the list after deletion
            props.fetchRecentNumbers();//trigger refresh for recent numbers in app.js
        })
        .catch(error => console.error(`Error deleting number ${numberId} - NumbersCalledComponent `, error));
        //optimistic delete option, shouldn't be necessary with fixed delete button structure
        //setAllNumbers(prevNumbers => [...prevNumbers], {id: numberId, number: numberId/* This has to be wrong, but I don't think the actual number was passed anywhere */})
    };

    function deleteAllNumbers() {
        axios.delete('/api/numbers-called/deleteAll')
        .then(response => {
            console.log('Deleted all numbers');
            fetchNumbers();
            props.fetchRecentNumbers();//trigger refresh for recent numbers in app.js
        })
        .catch(error => console.error('Error deleting all numbers - numbersCalledComponent', error));
    };

    return (
        <div className="numbers-called-component">
            <h2>Numbers Called</h2>
            
            {/* Delete all numbers button */}
            {allNumbers.length > 0 ? (
                <button onClick={deleteAllNumbers} className='delete-all-button'>
                    Delete AllNumbers
                </button>
            ) : (null)}

            {/* List of Numbers Called */}
            <div className="numbers-list">
                {allNumbers.length > 0 ? (
                    <ul>
                        {allNumbers.map((number) => (
                            <li key={number.id} className='number-item'>
                                {number.number}
                                <button 
                                    onClick={() => deleteNumber(number.id)} 
                                    className='delete-button'
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No numbers called yet.</p>
                )} 
            </div>
            {/* You can add a refresh button if you want <button onClick={fetchNumbers}>Refresh Numbers</button>*/}
            
        </div>
    );
});

export default NumbersCalledComponent;