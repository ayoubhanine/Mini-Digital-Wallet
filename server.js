// const http = require("http");
// const userRoutes = require("./routes/users");
// const walletRoutes = require("./routes/wallets");

// const server = http.createServer(async (req, res) => {
//   res.setHeader("Content-Type", "application/json");

//   if (req.url.startsWith("/users")) {
//     userRoutes(req, res);
//   } 
//   else if (req.url.startsWith("/wallets")) {
//     walletRoutes(req, res);
//   } 
//   else {
//     res.statusCode = 404;
//     res.end(JSON.stringify({ message: "Route not found" }));
//   }
// });

// server.listen(3001, () => {
//   console.log("Server running on http://localhost:3001");
// });
const http = require("http");
const userRoutes = require("./routes/users");
const walletRoutes = require("./routes/wallets");

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // On récupère uniquement le pathname (ignore query string)
  const baseUrl = req.url.split("?")[0].replace(/\/+$/, ""); // enlève slash final

  if (baseUrl.startsWith("/users")) {
    req.url = baseUrl; // met à jour req.url pour users.js
    userRoutes(req, res);
  } 
  else if (baseUrl.startsWith("/wallets")) {
    req.url = baseUrl;
    walletRoutes(req, res);
  } 
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});

