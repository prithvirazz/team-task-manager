const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 4173;
const HOST = "0.0.0.0";

const distPath = path.join(__dirname, "dist");

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  let filePath = path.join(distPath, req.url === "/" ? "index.html" : req.url);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(distPath, "index.html"), (indexErr, indexContent) => {
        if (indexErr) {
          res.writeHead(500);
          res.end("Error loading app");
          return;
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(indexContent);
      });
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
    });
    res.end(content);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Frontend running on http://${HOST}:${PORT}`);
});