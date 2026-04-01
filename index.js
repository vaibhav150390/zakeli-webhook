const http = require('http');
const url = require('url');
const https = require('https');

const VERIFY_TOKEN = 'zakeli_instagram_2026';
const N8N_URL = 'vaibhav1503.app.n8n.cloud';
const N8N_PATH = '/webhook/instagram-comments';

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const query = parsed.query;

  if (req.method === 'GET' && parsed.pathname === '/instagram') {
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];
    if (token === VERIFY_TOKEN) {
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
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Instagram event received:', JSON.stringify(data));
        
        const postData = JSON.stringify({ body: data });
        const options = {
          hostname: N8N_URL,
          path: N8N_PATH,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const n8nReq = https.request(options, (n8nRes) => {
          console.log('n8n response:', n8nRes.statusCode);
        });
        n8nReq.on('error', (e) => {
          console.log('n8n error:', e.message);
        });
        n8nReq.write(postData);
        n8nReq.end();

      } catch(e) {
        console.log('Parse error:', e.message);
      }

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
  console.log('Zakeli webhook server running on port ' + PORT);
});
