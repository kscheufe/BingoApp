//main express server file
const express = require("express");
const app = express();
const cors = require('cors');
const sqlite3 = require("sqlite3").verbose();
const path = require('path');

//initializeDb call - db is already initialized
const initDB = require("./db/initDB");//call init script

//connect to sqlite db
const dbPath = path.resolve(__dirname, 'db', 'bingo.db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) { 
        console.error("Error connecting to db: ", err.message);
    }
    else {
        console.log("connected to DB - index.js - at: " + dbPath);
    }
});
   
//import routes, passing in the DB connection
const winConditionsRoutes = require("./routes/winConditions")(db);
const numbersCalledRoutes = require("./routes/numbersCalled")(db);
const bingoCardsRoutes = require("./routes/bingoCards")(db);
//require()() - second () immediately invokes the function being imported

//middleware
app.use(cors());
app.use(express.json());

//use routes
app.use("/api/win-conditions", winConditionsRoutes);
app.use("/api/numbers-called", numbersCalledRoutes);
app.use("/api/bingo-cards", bingoCardsRoutes);

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);   
});
 