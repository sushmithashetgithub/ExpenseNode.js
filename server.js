const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ✅ Connect MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // or your password
  database: 'signupdb' // your DB name
});

db.connect((err) => {
  if (err) {
    console.log('MySQL connection failed:', err);
  } else {
    console.log('MySQL connected...');
  }
});

// ✅ Serve login.html by default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// ✅ LOGIN API
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if email exists
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err });
    }

    if (results.length === 0) {
      // ❌ User not found
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];

    // ✅ Compare password (plaintext for now)
    if (user.password === password) {
      return res.status(200).json({ message: 'User login successful' });
    } else {
      // ❌ Password mismatch
      return res.status(401).json({ message: 'Incorrect password' });
    }
  });
});

// ✅ Run the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
