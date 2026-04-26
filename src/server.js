/**
 * README Generator Web Server
 * 网站服务 - 托管在 Vercel/Netlify
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const ReadmeGenerator = require('./generator');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const generator = new ReadmeGenerator({
  aiApiKey: process.env.OPENAI_API_KEY,
});

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API routes
  if (req.url.startsWith('/api/')) {
    handleAPI(req, res);
    return;
  }

  // Static files
  let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/plain';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

async function handleAPI(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const readme = await generator.generate(data, {
          useAI: data.useAI,
          print: false,
        });
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, readme }));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } else if (req.url === '/api/templates' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(generator.listTemplates()));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
}

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📱 API endpoint: http://localhost:${PORT}/api/generate`);
});

module.exports = server;
