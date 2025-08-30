import http from "http";

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Server is running");
});

server.listen(4001, () => {
  console.log("Server listening on port 4001");
});
