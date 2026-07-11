const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to handle JSON data
app.use(express.json());
app.use(express.static('public'));

// A simple JSON file to act as our Database
const DB_FILE = 'database.json';

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ collections: [], totalPlastic: 0 }));
}

// API ROUTE 1: Get all collection data
app.get('/api/stats', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    res.json(data);
});

// API ROUTE 2: Save new plastic collection data (The robot calls this!)
app.post('/api/collect', (req, res) => {
    const { amount, timestamp, location } = req.body;
    
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    
    const newEntry = { amount, timestamp: timestamp || new Date(), location: location || "River Zone A" };
    data.collections.push(newEntry);
    data.totalPlastic += amount;
    
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    
    console.log(` Robot reported: ${amount} pieces collected!`);
    res.status(201).json({ message: "Data saved successfully!", total: data.totalPlastic });
});

app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
    console.log(` API ready for AquaGuardian Robot`);
});
