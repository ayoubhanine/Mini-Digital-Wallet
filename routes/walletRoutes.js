const { createWallet, getWallets, updateWallet, deleteWallet, deposit, withdraw } = require("../controllers/walletController")

function walletRoutes(req, res, body) {

  if (req.url === "/wallets") {
    if (req.method === "POST") return createWallet(req, res, body)
    if (req.method === "GET") return getWallets(req, res)
  }

  if (req.url.startsWith("/wallets/")) {
    if (req.method === "PUT") return updateWallet(req, res, body)
    if (req.method === "DELETE") return deleteWallet(req, res)
  }

  if (req.url === "/deposit" && req.method === "POST") return deposit(req, res, body)
  if (req.url === "/withdraw" && req.method === "POST") return withdraw(req, res, body)
}

module.exports = walletRoutes