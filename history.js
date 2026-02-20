const fs = require("fs");
const path = require("path");

const historyFile = path.join(__dirname, "history.json");

function saveOperation(operation) {
  let data = [];

  if (fs.existsSync(historyFile)) {
    const fileContent = fs.readFileSync(historyFile, "utf-8").trim();
    if (fileContent) {
      data = JSON.parse(fileContent);
    }
  }

  data.push(operation);

  fs.writeFileSync(historyFile, JSON.stringify(data, null, 2));
}

module.exports = { saveOperation };