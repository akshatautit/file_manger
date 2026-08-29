import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3000;
const FOLDER = 'files';

// Agar "files" folder nahi hai to bana do
if (!fs.existsSync(FOLDER)) {
  fs.mkdirSync(FOLDER);
}

const server = http.createServer((req, res) => {

  // ---------- HOME PAGE ----------
  if (req.url === '/' && req.method === 'GET') {
    const files = fs.readdirSync(FOLDER);

    let fileListHtml = '';
    files.forEach((file) => {
      fileListHtml += `<li>${file} 
        <a href="/view?name=${file}">View</a> 
        <a href="/delete?name=${file}">Delete</a>
      </li>`;
    });

    const html = `
      <h1>File Manager</h1>

      <form action="/create" method="POST">
        <input type="text" name="filename" placeholder="File name" required />
        <br><br>
        <textarea name="content" placeholder="File content"></textarea>
        <br><br>
        <button type="submit">Create File</button>
      </form>

      <h2>Files:</h2>
      <ul>${fileListHtml}</ul>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  // ---------- CREATE FILE ----------
  else if (req.url === '/create' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const data = new URLSearchParams(body);
      const filename = data.get('filename');
      const content = data.get('content');

      fs.writeFileSync(path.join(FOLDER, filename), content);

      res.writeHead(302, { Location: '/' });
      res.end();
    });
  }

  // ---------- VIEW FILE ----------
  else if (req.url.startsWith('/view') && req.method === 'GET') {
    const filename = new URL(req.url, 'http://localhost').searchParams.get('name');
    const content = fs.readFileSync(path.join(FOLDER, filename), 'utf-8');

    const html = `
      <h1>${filename}</h1>
      <pre>${content}</pre>
      <a href="/">Back</a>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  // ---------- DELETE FILE ----------
  else if (req.url.startsWith('/delete') && req.method === 'GET') {
    const filename = new URL(req.url, 'http://localhost').searchParams.get('name');
    fs.unlinkSync(path.join(FOLDER, filename));

    res.writeHead(302, { Location: '/' });
    res.end();
  }

  // ---------- 404 ----------
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
