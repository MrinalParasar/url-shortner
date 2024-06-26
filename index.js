console.log("Starting Node.js application...");

const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const cors = require('cors'); // Import cors module

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// CORS middleware configuration
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Replace with your frontend URL
    methods: ['GET', 'POST'], // Allow only specific methods
    allowedHeaders: ['Content-Type'], // Allow only specific headers
    credentials: true // Allow credentials such as cookies (if applicable)
}));

// Handle OPTIONS requests for preflight CORS checks
app.options('/api/shorten', cors()); // Enable preflight requests for /api/shorten

// Handle POST request to shorten URL
app.post('/api/shorten', (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'Missing originalUrl in request body' });
    }

    // Generate a unique slug using shortid
    const slug = shortid.generate();

    // Assuming you have a domain where you want to generate the shortened link
    const baseUrl = 'https://mrinalparasar.com';
    const shortenedUrl = `${baseUrl}/${slug}`;

    // You can store the mapping of slug to originalUrl in a database if needed

    // Respond with the shortened URL
    res.status(200).json({ shortenedUrl });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

