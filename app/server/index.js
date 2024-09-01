//main express server file
const express = require("express");
const app = express();
const cors = require('cors');
const sqlite3 = require("sqlite3").verbose();
const path = require('path');

//import routes
const winConditionsRoutes = require("./routes/winConditions");
const numbersCalledRoutes = require("./routes/numbersCalled");
const bingoCardsRoutes = require("./routes/bingoCards");

//middleware
app.use(cors());
app.use(express.json());

//connect to sqlite db
const db = new sqlite3.Database('./server/db/bingo.db', (err) => {
    if (err) { 
        console.error("Error connecting to db: ", err);
    }
    else {
        console.log("connected to DB");
    }
});
//initialize db
require("./db/initDB");//call init script

//use routes
app.use("/api/win-conditions", winConditionsRoutes);
app.use("/api/numbers-called", numbersCalledRoutes);
app.use("/api/bingo-cards", bingoCardsRoutes);


//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});