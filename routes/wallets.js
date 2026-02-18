const { wallets, users } = require("../data/store");

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

  // CREATE WALLET
  if (req.method === "POST" && req.url === "/wallets") {
    const body = await getRequestBody(req);

    if (!body.user_id || !body.name) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: "user_id and name required" }));
    }

    const userExists = users.find(u => u.id === body.user_id);

    if (!userExists) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    const newWallet = {
      id: wallets.length + 1,
      user_id: body.user_id,
      name: body.name,
      sold: 0
    };

    wallets.push(newWallet);

    res.statusCode = 201;
    return res.end(JSON.stringify(newWallet));
  }

  // GET ALL WALLETS
  if (req.method === "GET" && req.url === "/wallets") {
    return res.end(JSON.stringify(wallets));
  }

  // DEPOSIT
  if (req.method === "POST" && req.url.includes("/deposit")) {
    const id = parseInt(req.url.split("/")[2]);
    const body = await getRequestBody(req);

    const wallet = wallets.find(w => w.id === id);

    if (!wallet) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "Wallet not found" }));
    }

    wallet.sold += body.amount;

    return res.end(JSON.stringify(wallet));
  }

  // WITHDRAW
  if (req.method === "POST" && req.url.includes("/withdraw")) {
    const id = parseInt(req.url.split("/")[2]);
    const body = await getRequestBody(req);

    const wallet = wallets.find(w => w.id === id);

    if (!wallet) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "Wallet not found" }));
    }

    if (wallet.sold < body.amount) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: "Insufficient balance" }));
    }

    wallet.sold -= body.amount;

    return res.end(JSON.stringify(wallet));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: "Wallet route not found" }));
};
