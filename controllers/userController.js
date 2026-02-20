const { users } = require("../data/data")

// CREATE
function createUser(req, res, body) {
  const { name } = body

  if (!name) {
    res.writeHead(400)
    return res.end(JSON.stringify({ message: "Name required" }))
  }

  const user = {
    id: users.length + 1,
    name
  }

  users.push(user)

  res.writeHead(201)
  res.end(JSON.stringify(user))
}

// GET ALL
function getUsers(req, res) {
  res.writeHead(200)
  res.end(JSON.stringify(users))
}
// UPDATE
function updateUser(req, res, body) {
  const urlParts = req.url.split("/")
  const id = parseInt(urlParts[2])
  const user = users.find(u => u.id === id)

  if (!user) {
    res.writeHead(404)
    return res.end(JSON.stringify({ message: "User not found" }))
  }

  if (body.name) user.name = body.name

  res.writeHead(200)
  res.end(JSON.stringify(user))
}

// DELETE
function deleteUser(req, res) {
  const urlParts = req.url.split("/")
  const id = parseInt(urlParts[2])
  const index = users.findIndex(u => u.id === id)

  if (index === -1) {
    res.writeHead(404)
    return res.end(JSON.stringify({ message: "User not found" }))
  }

  users.splice(index, 1)
  res.writeHead(200)
  res.end(JSON.stringify({ message: "User deleted" }))
}

module.exports = { createUser, getUsers, updateUser, deleteUser }