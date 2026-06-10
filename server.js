// server.js – simple Express server for production SPA fallback
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the Vite build output directory
app.use(express.static(path.resolve(__dirname, 'dist')));

// SPA fallback: serve index.html for any non-file request
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Production server listening on http://localhost:${PORT}`);
});
