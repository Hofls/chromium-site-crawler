const assert = require("assert");
const archivator = require("../src/archivator");
const fs = require("fs");

describe("archivator", function() {
  it("should create archive", done => {
    let archiveName = "result.zip";
    if (fs.existsSync(archiveName)) {
      fs.unlinkSync(archiveName);
    }
    archivator.archivate(["tests/archivator-test.js"], function() {
      const stats = fs.statSync(archiveName);
      const fileSizeInBytes = stats.size;

      assert.ok(fs.existsSync(archiveName));
      assert.ok(fileSizeInBytes > 100);
      done();
      fs.unlinkSync(archiveName);
    });
  });

  it("should get files list", async () => {
    assert.equal("Dates.csv", archivator.getFilesList("default")[0]);
    assert.equal("Users.csv", archivator.getFilesList("default")[1]);
    assert.equal("Users.csv", archivator.getFilesList("users")[0]);
    assert.equal("Dates.csv", archivator.getFilesList("dates")[0]);
  });
});
