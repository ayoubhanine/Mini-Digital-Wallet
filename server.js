const http = require("http");
const userRoutes = require("./routes/users");
const walletRoutes = require("./routes/wallets");

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url.startsWith("/users")) {
    userRoutes(req, res);
  } 
  else if (req.url.startsWith("/wallets")) {
    walletRoutes(req, res);
  } 
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
