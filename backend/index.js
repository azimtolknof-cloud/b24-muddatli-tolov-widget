const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Example route for health check
app.get('/health', (req, res) => {
    res.status(200).send('Backend is running');
});

// Placeholder for OAuth token storage
app.post('/oauth', (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).send('Token is required');
    }
    // Save token logic here
    res.status(200).send('Token saved');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});