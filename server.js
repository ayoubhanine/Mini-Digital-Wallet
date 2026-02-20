const http = require("http")
const userRoutes = require("./routes/userRoutes")
const walletRoutes = require("./routes/walletRoutes")

const server = http.createServer((req, res) => {

  let body = ""

  req.on("data", chunk => {
    body += chunk.toString()
  })

  req.on("end", () => {

    body = body ? JSON.parse(body) : {}

    res.setHeader("Content-Type", "application/json")

    userRoutes(req, res, body)
    walletRoutes(req, res, body)

    if (!res.writableEnded) {
      res.writeHead(404)
      res.end(JSON.stringify({ message: "Route not found" }))
    }
  })
})

server.listen(3003, () => {
  console.log("Server running on port 3003")
})