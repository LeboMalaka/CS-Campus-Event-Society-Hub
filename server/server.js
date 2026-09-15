const express = require('express');
const app = express();

// Define the port (uses environment variable or defaults to 3000)
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// --- Routes ---

// Basic home route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Node.js server!' });
});

// Example of a custom GET route
app.get('/api/status', (req, res) => {
    res.json({ status: 'Server is running smoothly', timestamp: new Date() });
});

// Example of a POST route (handling JSON data)
app.use(express.urlencoded({ extended: true }));
app.post('/api/data', (req, res) => {
    const receivedData = req.body;
    res.json({
        message: 'Data received successfully!',
        data: receivedData
    });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running live at http://localhost:${PORT}`);
});