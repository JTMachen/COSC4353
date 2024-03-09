const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5500;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//Access fuel quote history JSON file
app.get('/fuelquotehistory', (req, res) => {
    console.log('Received request to /fuelquotehistory endpoint');
    fs.readFile('fuelquotehistory.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).send("Error reading JSON file");
            return;
        }
        const fuelQuotes = JSON.parse(data);
        res.json(fuelQuotes);
    });
});


//Serve static files from the 'public' directory (where our HTML, CSS, Javascript files are)
app.use(express.static('public'));

//Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
