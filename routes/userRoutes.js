const { createUser, getUsers, updateUser, deleteUser } = require("../controllers/userController")

function userRoutes(req, res, body) {
  if (req.method === "POST" && req.url === "/users") {
    return createUser(req, res, body)
  }

  if (req.method === "GET" && req.url === "/users") {
    return getUsers(req, res)
  }
    if (req.url.startsWith("/users/")) {
    if (req.method === "PUT") return updateUser(req, res, body)
    if (req.method === "DELETE") return deleteUser(req, res)
  }
}

module.exports = userRoutes