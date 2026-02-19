const { wallets, users } = require("../data/store");

const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject("Invalid JSON");
      }
    });

    req.on("error", reject);
  });
};

module.exports = async (req, res) => {      //C’est la fonction qui gère toutes les routes /wallets.
const urlParts = req.url.replace(/\/+$/, '').split("/").filter(Boolean); 
  // CREATE WALLET
  if (req.method === "POST" &&  urlParts.length === 1 && urlParts[0] === "wallets") {
    const body = await getRequestBody(req);   //Lire le body

    if (!body.user_id || !body.name) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: "user_id and name required" }));
    }

    const userExists = users.find(u => u.id === body.user_id); //Vérifier si user existe

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
  if (req.method === "GET" && urlParts.length === 1 && urlParts[0] === "wallets") {
    res.statusCode = 200;
    return res.end(JSON.stringify(wallets));
  }

  // DEPOSIT
  if (req.method === "POST" && urlParts.length === 3 && urlParts[0] === "wallets" && urlParts[2] === "deposit") {
    const id = parseInt(urlParts[1]);
     if (isNaN(id)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: "Invalid wallet ID" }));
    }
   

    const wallet = wallets.find(w => w.id === id);

    if (!wallet) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "Wallet not found" }));
    }
     const body = await getRequestBody(req);
    if (!body.amount || body.amount <= 0) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: "Invalid amount" }));
    }
    wallet.sold += body.amount;

    return res.end(JSON.stringify(wallet));
  }

  // Retirer
  if (req.method === "POST" && urlParts.length === 3 && urlParts[0] === "wallets" && urlParts[2] === "withdraw") {
    const id = parseInt(urlParts[1]);
    if (isNaN(id)) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: "Invalid wallet ID" }));
    }
    

    const wallet = wallets.find(w => w.id === id);

    if (!wallet) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ message: "Wallet not found" }));
    }
    const body = await getRequestBody(req);
     if (!body.amount || body.amount <= 0) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: "Invalid amount" }));
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
