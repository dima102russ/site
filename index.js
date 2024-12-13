const express = require('express');
const { Pool } = require('pg');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'webdesign',
  password: 'Id35459022di',
  port: 5432,
});

app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/news', (req, res) => {
  res.sendFile(__dirname + '/views/news.html');
});

app.get('/faq', (req, res) => {
  res.sendFile(__dirname + '/views/faq.html');
});

app.get('/contacts', (req, res) => {
  res.sendFile(__dirname + '/views/contacts.html');
});

app.get('/api/faqs', async (req, res) => {
  try {
    const result = await pool.query('SELECT question, answer FROM faqs');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/contacts', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await pool.query('INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3)', [name, email, message]);
    res.status(201).send('Contact information saved');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT password FROM admins WHERE username = $1', [username]);
    if (result.rows.length > 0 && result.rows[0].password === password) {
      req.session.user = username;
      return res.status(200).send('Logged in');
    }
    res.status(401).send('Invalid credentials');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out');
    }
    res.status(200).send('Logged out');
  });
});

app.get('/api/news', async (req, res) => {
  try {
    const result = await pool.query('SELECT image_url, title, date, content FROM news ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/news', upload.single('image'), async (req, res) => {
  if (!req.session.user) {
    return res.status(403).send('Unauthorized');
  }
  const { title, date, content } = req.body;
  const image_url = `/uploads/${req.file.filename}`;
  try {
    await pool.query('INSERT INTO news (image_url, title, date, content) VALUES ($1, $2, $3, $4)', [image_url, title, date, content]);
    res.status(201).send('News created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/user', (req, res) => {
  if (req.session.user) {
    res.json({ isAdmin: true }); // Replace with actual admin check
  } else {
    res.json({ isAdmin: false });
  }
});

app.get('/tournaments', (req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
