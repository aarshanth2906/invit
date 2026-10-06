const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const invitationPath = path.join(__dirname, "index.html");
const port = Number(process.env.PORT) || 5173;

const staticFiles = {
  "/favicon.svg": { file: "favicon.svg", type: "image/svg+xml" },
  "/favicon.png": { file: "favicon.png", type: "image/png" },
  "/apple-touch-icon.png": { file: "apple-touch-icon.png", type: "image/png" }
};

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;

  if (staticFiles[pathname]) {
    const { file, type } = staticFiles[pathname];
    fs.readFile(path.join(__dirname, file), (err, data) => {
      if (err) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }
      response.writeHead(200, { "Content-Type": type });
      response.end(data);
    });
    return;
  }

  if (pathname !== "/" && pathname !== "/Korattur") {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  fs.readFile(invitationPath, (error, html) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Unable to load the invitation.");
      console.error("Failed to read invitation:", error);
      return;
    }

    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(html);
  });
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Open http://localhost:${port} if the invitation server is already running, or stop the other process first.`
    );
    process.exitCode = 1;
    return;
  }

  throw error;
});

server.listen(port, () => {
  console.log(`Invitation running at http://localhost:${port}`);
});
