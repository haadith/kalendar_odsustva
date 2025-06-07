import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
app.use(express.json());

app.get('/api/calendar', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Cannot read data' });
      return;
    }
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: 'Invalid data' });
    }
  });
});

app.post('/api/calendar', (req, res) => {
  fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8', err => {
    if (err) {
      res.status(500).json({ error: 'Cannot save data' });
      return;
    }
    res.json({ status: 'ok' });
  });
});

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
