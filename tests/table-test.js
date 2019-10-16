const assert = require("assert");
const table = require("../src/table");
const browserModule = require("../src/browser");

describe("auth", function() {
  let browser;
  before(async () => {
    browser = await browserModule.launch(0);
  });
  after(async () => {
    browser.close();
  });

  let page;
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("file:\\\\" + __dirname + "\\html\\table-test.html");
  });
  afterEach(async () => {
    await page.close();
  });

  it("should return table rows", async () => {
    let rows = await table.readHistoryTable(page);
    assert.equal(5, rows.length);
    assert.equal("New", rows[0].newValue);
    assert.equal("System (SmartEmail_Processor)", rows[0].user);
    assert.equal("30/04/19 14:52:30", rows[0].date);
    assert.equal("Registered", rows[1].newValue);
    assert.equal("Rancho Olga Maksimova_729262", rows[1].user);
    assert.equal("30/04/19 14:53:37", rows[1].date);
    assert.equal("Additional info request", rows[2].newValue);
    assert.equal("Pirozhkova Olesia Verrlivna_1087396", rows[2].user);
    assert.equal("01/05/19 17:06:24", rows[2].date);
    assert.equal("Done", rows[3].newValue);
    assert.equal("Pirozhkova Olesia Verrlivna_1087396", rows[3].user);
    assert.equal("01/05/19 19:18:06", rows[3].date);
    assert.equal("Closed", rows[4].newValue);
    assert.equal("System (hpclinker6)", rows[4].user);
    assert.equal("06/05/19 19:18:23", rows[4].date);
  });
});
