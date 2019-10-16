const fs = require("fs");

var method = FileOutput.prototype;

function FileOutput(fileName) {
  this.fileName = fileName;
  this.delimiter = ";";
}

method.createNewFile = function() {
  fs.writeFileSync(this.fileName, "\ufeff", "utf8", function(err) {
    if (err) throw err;
  });
};

method.appendLine = function(...values) {
  let textLine = "";
  for (let value of values) {
    textLine += value + this.delimiter;
  }
  textLine += "\r\n";
  fs.appendFileSync(this.fileName, textLine, function(err) {
    if (err) throw err;
  });
};

module.exports = FileOutput;
