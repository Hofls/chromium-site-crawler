const assert = require("assert");
const fileInput = require("../src/file-input");

describe("auth", function() {
  it("should read a file", async () => {
    let filePath = "tests/txt/input-ok.txt";
    let linesArray = fileInput.readFile(filePath);

    assert.equal(4, linesArray.length);
    assert.equal("FG12344321", linesArray[0]);
    assert.equal("FG28834821", linesArray[1]);
    assert.equal("FG17222344", linesArray[2]);
    assert.equal("FG5938383", linesArray[3]);
  });
  it("should throw exception, because file is empty", async () => {
    let filePath = "tests/txt/input-empty.txt";
    let exceptionText = "";
    try {
      fileInput.readFile(filePath);
    } catch (e) {
      exceptionText = e;
    }
    assert.equal("File is empty", exceptionText);
  });
  it("should throw exception, because file contains incorrect lines", async () => {
    let filePath = "tests/txt/input-error.txt";
    let exceptionText = "";
    try {
      fileInput.readFile(filePath);
    } catch (e) {
      exceptionText = e;
    }
    assert.equal('Wrong line = "zsdgdfSD23131"', exceptionText);
  });
});
