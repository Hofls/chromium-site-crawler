const assert = require("assert");
const multithread = require("../src/multithread");

describe("auth", function() {
  it("should calculate remaining time", async () => {
    assert.equal("15", multithread.calculateRemainingTime(1, 0, 55));
    assert.equal("7", multithread.calculateRemainingTime(1, 25, 50));
    assert.equal("1", multithread.calculateRemainingTime(1, 49, 50));

    assert.equal("8", multithread.calculateRemainingTime(2, 0, 55));
    assert.equal("4", multithread.calculateRemainingTime(2, 25, 50));
    assert.equal("1", multithread.calculateRemainingTime(2, 49, 50));

    assert.equal("9", multithread.calculateRemainingTime(3, 0, 100));
    assert.equal("80", multithread.calculateRemainingTime(3, 0, 900));
  });

  it("should put all entities in one thread", async () => {
    let entityNames = ["FG11", "FG15", "FG20"];
    let distributed = multithread.distributeEntities(entityNames, 1);

    assert.equal("FG11", distributed[0][0]);
    assert.equal("FG15", distributed[0][1]);
    assert.equal("FG20", distributed[0][2]);
  });

  it("should distribute entities between 2 threads", async () => {
    let entityNames = ["FG11", "FG15", "FG20"];
    let distributed = multithread.distributeEntities(entityNames, 2);

    assert.equal("FG11", distributed[0][0]);
    assert.equal("FG20", distributed[0][1]);
    assert.equal("FG15", distributed[1][0]);
  });

  it("should put entity in one thread", async () => {
    let entityNames = ["FG11"];
    let distributed = multithread.distributeEntities(entityNames, 3);

    assert.equal("FG11", distributed[0][0]);
  });

  it("should distribute entities between 3 threads", async () => {
    let entityNames = [
      "FG11",
      "FG15",
      "FG20",
      "FG11b",
      "FG15b",
      "FG20b",
      "FG11c"
    ];
    let distributed = multithread.distributeEntities(entityNames, 3);

    assert.equal("FG11", distributed[0][0]);
    assert.equal("FG11b", distributed[0][1]);
    assert.equal("FG11c", distributed[0][2]);
    assert.equal("FG15", distributed[1][0]);
    assert.equal("FG15b", distributed[1][1]);
    assert.equal("FG20", distributed[2][0]);
    assert.equal("FG20b", distributed[2][1]);
  });
});
