const assert = require("assert");
const fs = require("fs");
const FileOutput = require("../src/file-output");

describe("auth", function() {
  it("should write to a file", async () => {
    let fileName = "result.csv";
    let fileOutput = new FileOutput("result.csv");
    fileOutput.createNewFile();
    fileOutput.appendLine("FG192931", "30/04/19 15:44:34", "30/04/19 16:00:20");
    fileOutput.appendLine("FG192931", "31/05/19 11:44:34", "31/05/19 19:00:20");
    fileOutput.appendLine("FG4328281", "", "");

    let actualA = fs.readFileSync("result.csv", "utf8");
    let expected =
      "﻿FG192931;30/04/19 15:44:34;30/04/19 16:00:20;\r\n" +
      "FG192931;31/05/19 11:44:34;31/05/19 19:00:20;\r\n" +
      "FG4328281;;;\r\n";
    assert.equal(expected, actualA);
    fs.unlinkSync(fileName);
  });
});
