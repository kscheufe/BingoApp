import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NumbersCalledComponent(/*{ recentNumbers, fetchNumbers }*/) {
    const [allNumbers, setAllNumbers] = useState([]);

    //fetch all numbers when component mounts
    useEffect(() => {
        fetchNumbers();
    }, []);

    const fetchNumbers = () => {
        axios.get('/api/numbers-called/')
        .then(response => {
            const sortedNumbers = [...response.data].sort((a, b) => b.id - a.id);
            setAllNumbers(sortedNumbers);//store complete list
        })
        .catch(error => console.error("Error fetching called numbers - NumbersCalledComponent", error));
    }

    function deleteNumber(numberId) {
        console.log("delete number id: " + numberId + " called");
        axios.delete(`/api/numbers-called/deleteIndividual/${numberId}`)
        .then(response => {
            console.log(`Deleted number with id ${numberId}`);
            fetchNumbers();//refresh the list after deletion
        })
        .catch(error => console.error(`Error deleting number ${numberId} - NumbersCalledComponent `, error));
    };

    function deleteAllNumbers() {
        axios.delete('/api/numbers-called/deleteAll')
        .then(response => {
            console.log('Deleted all numbers');
            fetchNumbers();
        })
        .catch(error => console.error('Error deleting all numbers - numbersCalledComponent', error));
    }

    return (
        <div className="numbers-called-component">
            <h2>Numbers Called</h2>
            
            {/* Delete all numbers button */}
            <button onClick={deleteAllNumbers} className='delete-all-button'>
                Delete AllNumbers
            </button>

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
            {/* You can add a refresh button if you want */}
            <button onClick={fetchNumbers}>Refresh Numbers</button>
        </div>
    );
}

export default NumbersCalledComponent;