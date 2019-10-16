const pageActions = require("./page-actions");
const browserModule = require("./browser");

/**
 * Login/logout from the system
 */
module.exports = {
  /**
   * Return login/password pairs TODO - move to the config
   */
  getCredentials: function() {
    let credentials = [];
    credentials.push({ login: "TestUserA", password: "TestPasswordA" });
    credentials.push({ login: "TestUserB", password: "TestPasswordB" });
    return credentials;
  },

  /**
   * Log into system
   */
  login: function(page, url, credentials) {
    return (async () => {
      console.log("Logging into system with url " + url);
      await page.goto(url);
      await page.type("input#LoginUsername", credentials.login);
      await page.type("input#LoginPassword", credentials.password);
      await pageActions.clickAndWait(page, "input#loginBtn");
    })();
  },

  /**
   * Log out of the system
   */
  logout: function(page) {
    return (async () => {
      try {
        console.log("Log out of the system");
        await pageActions.clickXpath(
          page,
          "//*/text()[normalize-space(.) = 'User info']/parent::button"
        );
        await page.waitFor(500);
        await page.on("dialog", async dialog => {
          await dialog.accept();
        });
        await pageActions.clickXpath(
          page,
          "//*/text()[normalize-space(.) = 'Logout']/parent::button"
        );
      } catch (e) {
        console.log(
          "Error while trying to log out. Trying to ignore it: " + e.toString()
        );
      }
    })();
  },

  /**
   * Continue work in a new tab (if one tries to work in the same tab for a long time - RAM grows endlessly)
   */
  continueInNewPage: function(page, url, browser) {
    return (async () => {
      console.log("Continue work in a new tab");
      await page.close();
      let newPage = await browserModule.newEmptyPage(browser);
      await newPage.goto(url);
      await pageActions.clickAndWait(newPage, "a#btnContinue");
      return newPage;
    })();
  }
};
