const http = require('http');
const url = require('url');

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const query = parsed.query;
  
  if (req.method === 'GET' && parsed.pathname === '/instagram') {
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
  
  if (req.method === 'POST' && parsed.pathname === '/instagram') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        
        const n8nUrl = 'https://vaibhav1503.app.n8n.cloud/webhook/instagram-comments';
        
        const https = require('https');
        const postData = JSON.stringify({ body: data });
        
        const options = {
          hostname: 'vaibhav1503.app.n8n.cloud',
          path: '/webhook/instagram-comments',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };
        
        const n8nReq = https.request(options);
        n8nReq.write(postData);
        n8nReq.end();
        
      } catch(e) {}
      
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({status: 'ok'}));
    });
    return;
  }
  
  res.writeHead(200);
  res.end(JSON.stringify({status: 'Zakeli webhook running'}));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
