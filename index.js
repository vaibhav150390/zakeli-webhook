const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const query = parsed.query;
  
  if (parsed.pathname === '/instagram') {
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    
    if (token === 'zakeli_instagram_2026') {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(challenge);
      return;
    }
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({status: 'Zakeli webhook server running'}));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
