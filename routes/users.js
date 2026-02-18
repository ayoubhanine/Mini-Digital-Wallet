const { users } = require("../data/store");

const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (!body) return resolve({});
      resolve(JSON.parse(body));
    });

    req.on("error", reject);
  });
};

module.exports = async (req, res) => {

  // CREATE USER
  if (req.method === "POST" && req.url === "/users") {
    const body = await getRequestBody(req);

    if (!body.name) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: "Name required" }));
    }

    const newUser = {
      id: users.length + 1,
      name: body.name
    };

    users.push(newUser);

    res.statusCode = 201;
    return res.end(JSON.stringify(newUser));
  }

  // GET ALL USERS
  if (req.method === "GET" && req.url === "/users") {
    res.statusCode = 200;
    return res.end(JSON.stringify(users));
  }

  // GET USER BY ID
  if (req.method === "GET" && req.url.startsWith("/users/")) {
    const id = parseInt(req.url.split("/")[2]);

    const user = users.find(u => u.id === id);

    if (!user) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    return res.end(JSON.stringify(user));
  }

  // DELETE USER
  if (req.method === "DELETE" && req.url.startsWith("/users/")) {
    const id = parseInt(req.url.split("/")[2]);

    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    users.splice(index, 1);

    return res.end(JSON.stringify({ message: "User deleted" }));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: "Users route not found" }));
};
