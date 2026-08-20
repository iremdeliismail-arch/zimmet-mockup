const http = require("http");
const fs = require("fs");
const path = require("path");
const root = __dirname;
const port = 8765;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
http
  .createServer((req, res) => {
    const u = new URL(req.url, "http://127.0.0.1");
    let p = decodeURIComponent(u.pathname);
    if (p === "/") p = "/index.html";
    const file = path.join(root, path.normalize(p).replace(/^(\.\.[/\\])+/, ""));
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found: " + p);
        return;
      }
      res.writeHead(200, {
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
      });
      res.end(data);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log("listening http://127.0.0.1:" + port + "/");
  });
