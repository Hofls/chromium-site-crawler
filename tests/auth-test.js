const assert = require("assert");
const auth = require("../src/auth");
const browserModule = require("../src/browser");

describe("auth", function() {
  let browser;
  before(async () => {
    browser = await browserModule.launch();
  });
  after(async () => {
    browser.close();
  });

  let page;
  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("file:\\\\" + __dirname + "\\html\\auth-test.html");
  });
  afterEach(async () => {
    await page.close();
  });

  it("should log into system", async () => {
    await auth.login(page, page.url(), { login: "valera", password: "qwerty" });
    assert.ok(page.url().includes("/empty_page.html"));
    assert.ok(page.url().includes("login=valera"));
    assert.ok(page.url().includes("password=qwerty"));
  });

  it("should log out of the system", async () => {
    await auth.logout(page);
    assert.ok(page.url().includes("/empty_page.html?logout"));
  });

  it("should return credentials", async () => {
    let credentials = auth.getCredentials(page);
    assert.ok(credentials.length > 0);
    assert.ok(credentials[0].login);
    assert.ok(credentials[0].password);
  });
});
