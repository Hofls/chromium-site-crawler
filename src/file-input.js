const fs = require("fs");

module.exports = {
  /**
   * Returns array of lines from the file
   */
  readFile: function(fileName = "input.txt") {
    var linesArray = fs
      .readFileSync(fileName)
      .toString()
      .replace(/\r\n/g, "\n")
      .split("\n");
    var nonEmptyLines = [];
    for (let line of linesArray) {
      if (line.trim()) {
        if (!line.match(/^FG\d+$/g)) {
          throw `Wrong line = "${line}"`;
        }
        nonEmptyLines.push(line);
      }
    }
    if (nonEmptyLines.length <= 0) {
      throw "File is empty";
    }

    return nonEmptyLines;
  }
};
