const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

const UPLOADS_DIR = './uploads';
const DB_FILE = './playlist.db';

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Setup CORS
app.use(cors());

// Setup database
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the playlist database.');
  db.run(`CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT,
    albumArtUrl TEXT,
    audioUrl TEXT NOT NULL UNIQUE
  )`);
});

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    // Use original name, sanitize it if necessary
    cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8'));
  }
});

const upload = multer({ storage: storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API endpoint to get all songs
app.get('/api/songs', (req, res) => {
  db.all("SELECT * FROM songs ORDER BY title", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to upload songs from a folder
app.post('/api/upload', upload.array('songs'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const stmt = db.prepare("INSERT OR IGNORE INTO songs (title, artist, albumArtUrl, audioUrl) VALUES (?, ?, ?, ?)");
  
  req.files.forEach(file => {
    if (file.mimetype.startsWith('audio/')) {
        const title = path.basename(file.originalname, path.extname(file.originalname));
        const audioUrl = `/uploads/${file.filename}`;
        const artist = 'Unknown Artist'; // Placeholder
        const albumArtUrl = 'https://picsum.photos/seed/default-art/500/500'; // Placeholder
        
        stmt.run(title, artist, albumArtUrl, audioUrl, (err) => {
            if (err) {
                console.error("DB insert error:", err.message);
            }
        });
    }
  });

  stmt.finalize((err) => {
    if (err) {
        console.error("DB finalize error:", err.message);
        return res.status(500).json({ error: "Failed to finalize database operation." });
    }
    res.status(201).json({ message: 'Files uploaded and processed successfully.' });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
