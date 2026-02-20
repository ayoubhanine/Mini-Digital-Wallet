const fs = require("fs"); //fs → File System, permet de lire/écrire des fichiers
const path = require("path"); //path → permet de travailler avec les chemins de fichiers de façon sécurisée, compatible Windows/Linux


//__dirname → dossier où se trouve ce fichier history.js
// path.join() → crée un chemin correct pour le fichier
// historyFile = chemin complet vers history.json
const historyFile = path.join(__dirname, "history.json"); 
function saveOperation(operation) {  // operation → objet représentant une transaction (deposit ou withdraw)
  let data = [];

  if (fs.existsSync(historyFile)) {  //Vérifier si le fichier existe
    const fileContent = fs.readFileSync(historyFile, "utf-8").trim();
    if (fileContent) {
      data = JSON.parse(fileContent);
    }
  }
 // fs.readFileSync() → lit le fichier synchroniquement
// "utf-8" → encode le texte
// .trim() → supprime les espaces ou retours à la ligne en début/fin
// fileContent = le texte brut dans history.json
  data.push(operation);

  fs.writeFileSync(historyFile, JSON.stringify(data, null, 2));
}

module.exports = { saveOperation };