// Simple static file server
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

// Create the server
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Handle favicon.ico requests
  if (req.url === '/favicon.ico') {
    res.statusCode = 204; // No content
    res.end();
    return;
  }
  
  // Get the file path
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // Get the extension
  const extname = path.extname(filePath);
  
  // Get the content type
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Page not found
        fs.readFile('./index.html', (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
            return;
          }
          
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Set port
const PORT = process.env.PORT || 5001;

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});