const assert = require("assert");
const server = require("../src/server");
const http = require("http");

describe("server", function() {
  before(async () => {
    server.run();
  });
  after(async () => {
    server.stop();
  });

  it("should launch server with functional endpoints", done => {
    http.get("http://localhost:8080/health", res => {
      res.on("data", function(body) {
        assert.equal("OK", body.toString());
        done();
      });
    });
  });
});
