const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});
const PORT = 8007;

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api') || req.url.startsWith('/docs') || req.url.startsWith('/swagger-ui')) {
    // Arahkan ke Backend
    proxy.web(req, res, { target: 'http://localhost:3000' });
  } else {
    // Arahkan ke Frontend
    proxy.web(req, res, { target: 'http://localhost:8081' });
  }
});

proxy.on('error', (err, req, res) => {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Proxy Error');
});

console.log(`Proxy server running on http://localhost:${PORT}`);
server.listen(PORT);
