const { wallets, users } = require("../data/data")
const { saveOperation} =require("../history")
// CREATE WALLET
function createWallet(req, res, body) {
  const { user_id, name } = body
  const user = users.find(u => u.id == user_id)
  if (!user) {
    res.writeHead(404)
    return res.end(JSON.stringify({ message: "User not found" }))
  }
  const maxId=wallets.length>0
  ?Math.max(...wallets.map(wallet=>wallet.id)):0;

  const wallet = { id: maxId + 1, user_id, name, sold: 0 }
  wallets.push(wallet)
  res.writeHead(201)
  res.end(JSON.stringify(wallet))
}

// GET ALL
function getWallets(req, res) {
  res.writeHead(200)
  res.end(JSON.stringify(wallets))
}

// UPDATE WALLET
function updateWallet(req, res, body) {
  const urlParts = req.url.split("/")
  const id = parseInt(urlParts[2])
  const wallet = wallets.find(w => w.id === id)
  if (!wallet) {
    res.writeHead(404)
    return res.end(JSON.stringify({ message: "Wallet not found" }))
  }

  if (body.name) wallet.name = body.name
  res.writeHead(200)
  res.end(JSON.stringify(wallet))
}

// DELETE WALLET
function deleteWallet(req, res) {
  const urlParts = req.url.split("/")
  const id = parseInt(urlParts[2])
  const index = wallets.findIndex(w => w.id === id)

  if (index === -1) {
    res.writeHead(404)
    return res.end(JSON.stringify({ message: "Wallet not found" }))
  }

  wallets.splice(index, 1)
  res.writeHead(200)
  res.end(JSON.stringify({ message: "Wallet deleted" }))
}

// DEPOSIT
function deposit(req, res, body) {
  const { wallet_id, amount } = body
  const wallet = wallets.find(w => w.id == wallet_id)

  if (!wallet) {
    res.writeHead(404)
    return res.end(JSON.stringify({ message: "Wallet not found" }))
  }
  if (amount <= 0) {
    res.writeHead(400)
    return res.end(JSON.stringify({ message: "Invalid amount" }))
  }

  wallet.sold += amount
   //  Enregistrer l'opération dans history.json
  saveOperation({
    wallet_id: wallet.id,
    user_id: wallet.user_id,
    type: "deposit",
    amount,
    date: new Date().toISOString()
  })
  res.writeHead(200)
  res.end(JSON.stringify(wallet))
}

// WITHDRAW
function withdraw(req, res, body) {
  const { wallet_id, amount } = body
  const wallet = wallets.find(w => w.id == wallet_id)

  if (!wallet) {
    res.writeHead(404)
    return res.end(JSON.stringify({ message: "Wallet not found" }))
  }
  if (amount <= 0) {
    res.writeHead(400)
    return res.end(JSON.stringify({ message: "Invalid amount" }))
  }
  if (wallet.sold < amount) {
    res.writeHead(400)
    return res.end(JSON.stringify({ message: "Insufficient balance" }))
  }

  wallet.sold -= amount
   saveOperation({
    wallet_id: wallet.id,
    user_id: wallet.user_id,
    type: "withdraw",
    amount,
    date: new Date().toISOString()
  })
  res.writeHead(200)
  res.end(JSON.stringify(wallet))
}

module.exports = { createWallet, getWallets, updateWallet, deleteWallet, deposit, withdraw }