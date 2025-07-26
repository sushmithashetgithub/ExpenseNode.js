const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); // Make sure db.js is correctly configured

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ✅ Signup API
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Step 1: Check for empty input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Step 2: Check if email already exists
  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      console.error('Check error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'User already exists' }); // 409 Conflict
    }

    // Step 3: Insert user
    const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertQuery, [name, email, password], (err, result) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).json({ message: 'Signup failed' });
      }

      return res.status(201).json({ message: 'Signup successful' });
    });
  });
});

// Redirect root to signup.html (optional)
app.get('/', (req, res) => {
  res.redirect('/signup.html');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
