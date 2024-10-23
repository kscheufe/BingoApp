import React, { useEffect } from 'react';

function NumbersCalledComponent({ recentNumbers, fetchNumbers }) {
    useEffect(() => {
        fetchNumbers();
    }, [fetchNumbers]);

    return (
        <div className="numbersCalledComponent">
            <h2>Numbers Called</h2>
            <div className="numbersList">
                {recentNumbers.length > 0 ? (
                    <ul>
                        {recentNumbers.map((number) => (
                            <li key={number.id}>
                                {number.number}
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