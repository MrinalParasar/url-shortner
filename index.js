console.log("Starting Node.js application...");

const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// CORS middleware configuration
app.use(cors({
    origin: 'https://indiatimesnow.online', // Replace with your frontend URL
    methods: ['GET', 'POST'], // Allow only specific methods
    allowedHeaders: ['Content-Type'], // Allow only specific headers
    credentials: true // Allow credentials such as cookies (if applicable)
}));

// Handle OPTIONS requests for preflight CORS checks
app.options('/api/shorten', cors()); // Enable preflight requests for /api/shorten

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'u321378971_url', // Your MySQL username
    password: 'Mrinal@8888', // Your MySQL password
    database: 'u321378971_link' // Your database name
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Handle POST request to shorten URL
app.post('/api/shorten', (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'Missing originalUrl in request body' });
    }

    // Generate a unique slug using shortid
    const slug = shortid.generate();

    // Assuming you have a domain where you want to generate the shortened link
    const baseUrl = 'https://indiatimesnow.online';
    const shortenedUrl = `${baseUrl}/${slug}`;

    // Insert the slug and originalUrl into the database
    const query = 'INSERT INTO links (slug, originalUrl) VALUES (?, ?)';
    db.query(query, [slug, originalUrl], (err, result) => {
        if (err) {
            console.error('Database insertion error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        // Respond with the shortened URL
        res.status(200).json({ shortenedUrl });
    });
});

// Endpoint to redirect to the original URL
app.get('/:slug', (req, res) => {
    const slug = req.params.slug;

    const query = 'SELECT originalUrl FROM links WHERE slug = ?';
    db.query(query, [slug], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal server error');
        }
        if (result.length > 0) {
            res.redirect(result[0].originalUrl);
        } else {
            res.status(404).send('URL not found');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
