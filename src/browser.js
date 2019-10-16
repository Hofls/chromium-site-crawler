const puppeteer = require("puppeteer");

/**
 * Browser control
 */
module.exports = {
  /**
   * Launching browser
   */
  launch: async function() {
    return await (async () => {
      console.log(
        "Browser launches with active profile - |" +
          process.env.NODE_PROFILE +
          "|"
      );
      let params = {
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage"
        ]
      };
      if (process.env.NODE_PROFILE === "dev") {
        params.headless = false;
      }
      const browser = await puppeteer.launch(params);
      return browser;
    })();
  },

  /**
   * Opens new empty page
   */
  newEmptyPage: async function(browser) {
    return await (async () => {
      console.log("Opens new page");
      const mainPage = await browser.newPage();
      await mainPage.setViewport({ width: 1800, height: 800 }); // it is important to set screen size, because systems behavior changes on little screens

      // trying to pass as a normal browser:
      await mainPage.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
      );
      await mainPage.setExtraHTTPHeaders({
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
      });
      await mainPage.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", {
          get: () => false
        });
      });
      return mainPage;
    })();
  }
};
