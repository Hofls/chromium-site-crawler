const assert = require("assert");
const pageActions = require("../src/page-actions");
const browserModule = require("../src/browser");
const dateUtils = require("../src/date-utils");

describe("page-actions", function() {
  let browser;
  before(async () => {
    pageActions.DELAY_MS = 50;
    browser = await browserModule.launch(0);
  });
  after(async () => {
    browser.close();
  });

  let page;
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("file:\\\\" + __dirname + "\\html\\page-actions-test.html");
  });
  afterEach(async () => {
    await page.close();
  });

  it("should return instantly, because there is no loading element", async () => {
    await pageActions.waitUntilElementNotFound(
      page,
      "//div[contains(@class, 'x-mask-loading-unexistant')]"
    );
  });

  it("should return after some time, because element dissapears", async () => {
    await page.click("#hideLoadingDiv");
    await pageActions.waitUntilElementNotFound(
      page,
      "//div[contains(@class, 'x-mask-short-loading')]",
      550
    );
  });

  it("should throw exception, because element is never disappears", async () => {
    let exceptionText = "";
    try {
      await pageActions.waitUntilElementNotFound(
        page,
        "//div[contains(@class, 'x-mask-loading-forever')]",
        550
      );
    } catch (e) {
      exceptionText = e;
    }
    assert.equal(
      "Element //div[contains(@class, 'x-mask-loading-forever')] did not disappeared in 550 ms",
      exceptionText
    );
  });

  it("should get all elements(xpath) when they appear (at 450ms)", async () => {
    await page.click("#showElementsAfter450ms");
    let elems = await pageActions.getAllWhenXpathAppears(
      page,
      "//div[@class='oldclass newclass']",
      dateUtils.SECOND,
      false
    );
    assert.equal(
      "div_id1",
      await (await elems[0].getProperty("id")).jsonValue()
    );
    assert.equal(
      "div_id2",
      await (await elems[1].getProperty("id")).jsonValue()
    );
    assert.equal(
      "div_id3",
      await (await elems[2].getProperty("id")).jsonValue()
    );
  });

  it("should throw exception because elements not appear in time (250ms)", async () => {
    let exceptionText = "";
    try {
      await pageActions.getAllWhenXpathAppears(
        page,
        "//div[@class='oldclass newclass']",
        dateUtils.SECOND,
        false
      );
    } catch (e) {
      exceptionText = e;
    }
    assert.equal(
      "Element //div[@class='oldclass newclass'] not found in 1000 ms",
      exceptionText
    );
  });

  it("should get element(xpath) when it appears (at 500ms)", async () => {
    await page.click("#showElementAfter500ms");
    let elem = await pageActions.getWhenXpathAppears(
      page,
      "//div[@id='new_elem_id']",
      dateUtils.SECOND
    );
    const innerHtml = await page.evaluate(el => el.innerHTML, elem);
    assert.equal("<div>wild element appears!</div>", innerHtml.trim());
  });

  it("should throw exception because element not appears in time (250ms)", async () => {
    let exceptionText = "";
    try {
      await pageActions.getWhenXpathAppears(
        page,
        "//div[@id='new_elem_id']",
        250
      );
    } catch (e) {
      exceptionText = e;
    }
    assert.equal(
      "Element //div[@id='new_elem_id'] not found in 250 ms",
      exceptionText
    );
  });

  it("should find element inside of a frame", async () => {
    let elem = await pageActions.getWhenXpathAppears(
      page,
      "//div[@id='element_in_frame']",
      dateUtils.SECOND
    );
    const innerHtml = await elem.$eval("div", node => node.innerHTML);
    assert.equal("Element inside frame!", innerHtml);
  });

  it("should click button and wait for page to load", async () => {
    await pageActions.clickAndWait(page, "input#open_empty_page");
    assert.ok(page.url().includes("/empty_page.html"));
  });

  it("should find and click element (XPath)", async () => {
    await pageActions.clickXpath(
      page,
      '//a[starts-with(normalize-space(), ".Done")]'
    );
    assert.ok(page.url().includes("/empty_page.html"));
  });

  it("should find and click element with &nbsp; (XPath) ", async () => {
    await pageActions.clickXpath(
      page,
      "//*/text()[normalize-space(.) = 'History" +
        String.fromCharCode(160) +
        "']/parent::a"
    );
    assert.ok(page.url().includes("/empty_page.html"));
  });

  it("should type in input element (XPath)", async () => {
    let elem = await pageActions.typeXpath(
      page,
      "//input[@id='real_input_id']",
      "its me, text"
    );
    assert.equal(
      "its me, text",
      await (await elem.getProperty("value")).jsonValue()
    );
  });

  it("should find input by label (XPath)", async () => {
    let input = await pageActions.findInputByLabelXpath(
      page,
      "//label[@id='label-linked-with-input']"
    );
    assert.equal(
      "real_input_id",
      await (await input.getProperty("id")).jsonValue()
    );
  });
});
