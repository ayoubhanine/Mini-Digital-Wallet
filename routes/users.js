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
const urlParts = req.url.split("/").filter(Boolean); // ["users"] ou ["users", "1"]
  // CREATE USER
  if (req.method === "POST" && urlParts.length === 1 && urlParts[0] === "users") {
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
  if (req.method === "GET" && urlParts.length === 1 && urlParts[0] === "users") {
    res.statusCode = 200;
    return res.end(JSON.stringify(users));
  }

  // GET USER BY ID
  if (req.method === "GET" && urlParts.length === 2 && urlParts[0] === "users") {
    const id =parseInt(urlParts[1]);
    if (isNaN(id)) {
  res.statusCode = 400;
  return res.end(JSON.stringify({ message: "Invalid user ID" }));
}

    const user = users.find(u => u.id === id);

    if (!user) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    return res.end(JSON.stringify(user));
  }

  // DELETE USER
  if (req.method === "DELETE" &&urlParts.length === 2 && urlParts[0] === "users" ) {
    const id = parseInt(urlParts[1]);
    if (isNaN(id)) {
  res.statusCode = 400;
  return res.end(JSON.stringify({ message: "Invalid user ID" }));
}

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
