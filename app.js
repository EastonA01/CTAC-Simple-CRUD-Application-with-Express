// Import the Express module and any third-party middleware
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan')
const app = express();

// Morgan middleware
app.use(morgan('tiny')); //Logs all incoming console requests

// JSON parsing middleware
app.use(bodyParser.json());

// Simple in-memory data store
const items = [];

// Generate a unique ID
function generateId() {
    return Math.floor(Math.random() * Date.now()).toString(); // Works better imo than just Date.now()
}

// POST route to add a new item
app.post('/items', (req, res) => {
    // newItem is declared as body of request
    const newItem = req.body;
    // id comes from generateId func
    newItem.id = generateId();
    // Add object to item array
    items.push(newItem);
    // Return with 201 "good" status
    res.status(201).json(newItem);
});

// GET route to list all items
app.get('/items', (req, res) => {
    // Response is items array
    res.json(items);
});

// GET route to retrieve a single item by its id
app.get('/items/:id', (req, res) => {
    // Grab item id via parameters
    const itemId = req.params.id;
    // Check for foundItem, should return true or false
    const foundItem = items.find(item => item.id === itemId);
    if (foundItem) { // If item is found
        res.json(foundItem);
    } else {
        res.status(404).send('Item not found');
    }
});

// PUT route to update an item by its id
app.put('/items/:id', (req, res) => {
    // Grab item id via parameters
    const itemId = req.params.id;
    // Body is item to update(?)
    const update = req.body;
    // Find item in array via findIndex, returns true if found
    const index = items.findIndex(item => item.id === itemId);
    if (index !== -1) { // If item IS found
        items[index] = { ...items[index], ...update }; // Update
        res.json(items[index]); // Return response of item
    } else {
        res.status(404).send('Item not found');
    }
});

// DELETE route to delete an item by its id
app.delete('/items/:id', (req, res) => {
    // Grab item id via parameters
    const itemId = req.params.id;
    // Filter out item via ID
    items = items.filter(item => item.id !== itemId);
    res.status(204).send();
});

app.all('*', (req, res) => { // End all for routes that dont exist or other errors
  res.send('404 ERROR. ROUTE NOT FOUND')
})

// Port declaration and listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});