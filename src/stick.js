const auth = require("./auth");
const browserModule = require("./browser");
const pageActions = require("./page-actions");
const table = require("./table");
const calc = require("./calc");

const dateUtils = require("./date-utils");

var method = Stick.prototype;

function Stick(threadName) {
  this.threadName = threadName;
  this.setDefaultValues();
}

method.getProgress = function() {
  return {
    processedCount: this.processedEntitiesCount,
    totalCount: this.totalEntitiesCount,
    exception: this.exceptionText
  };
};

method.emergencyStop = function() {
  this.stopped = true;
  this.log("Received emergency stop signal");
};

method.log = function(text) {
  console.log(this.threadName + " - " + text);
};

method.setDefaultValues = function() {
  this.totalEntitiesCount = 0;
  this.processedEntitiesCount = 0;
  this.exceptionText = "";
  this.stopped = false;
};

/**
 * Crawler enters the system, finds entities, writes report to files
 */
method.launch = function(
  inputFilePath,
  credentials,
  entityNames,
  rangeOutput,
  userOutput,
  callback
) {
  (async () => {
    this.setDefaultValues();

    try {
      this.totalEntitiesCount = entityNames.length;

      this.log("Crawler started. " + new Date());
      this.browser = await browserModule.launch();
      let page = await browserModule.newEmptyPage(this.browser);

      // enter in the system
      let url = "CENSORED :)";
      await auth.login(page, url, credentials);

      let entityNumber = 0;
      let retriesInARow = 0;
      let iterations = 0;
      while (entityNumber < entityNames.length) {
        if (this.stopped) {
          this.log("User decided to stop crawler");
          break;
        }

        iterations++;
        if (iterations % 9 === 0) {
          page = await auth.continueInNewPage(page, url, this.browser);
        }

        this.processedEntitiesCount = entityNumber;
        let entityName = entityNames[entityNumber];

        try {
          this.log("=================================");
          this.log(new Date());
          this.log(`Looking for entity ${entityName}`);
          await pageActions.clickXpath(
            page,
            "//button[@aria-label='Entity search.']"
          );
          let input = await pageActions.findInputByLabelXpath(
            page,
            "//*/text()[normalize-space(.) = 'Entity code:']/parent::label"
          );

          await pageActions.type(page, input, entityName);
          await pageActions.press(page, input, "Enter");

          this.log("Go to the section 'History' inside entity card");
          await pageActions.clickXpath(
            page,
            "//*/text()[normalize-space(.) = 'History" +
              String.fromCharCode(160) +
              "']/parent::a"
          );
          await pageActions.clickXpath(
            page,
            "//*/text()[normalize-space(.) = 'Show full history']/parent::button"
          );

          this.log("Search status in history");
          let filterInput = await pageActions.findInputByLabelXpath(
            page,
            "//*/text()[normalize-space(.) = 'Field:']/parent::label"
          );
          await pageActions.type(page, filterInput, "Status");
          await pageActions.clickXpath(
            page,
            "//button[@aria-label='Search (Alt+F12)']"
          );

          this.log("Read history table");
          let rows = await table.readHistoryTable(page);
          this.log("Calculate periods");
          let ranges = calc.calculateRanges(rows);
          if (ranges.length <= 0) {
            rangeOutput.appendLine(entityName, "", "");
          }
          for (let range of ranges) {
            rangeOutput.appendLine(entityName, range.start, range.end);
          }

          this.log("Extracting users who asked for additional info");
          let users = calc.findUsersWhoRequested(rows);
          if (users.length <= 0) {
            userOutput.appendLine(entityName, "");
          }
          for (let user of users) {
            userOutput.appendLine(entityName, user.user);
          }
          entityNumber++;
          retriesInARow = 0;
        } catch (e) {
          this.log("Exception! retrying entity processing. " + e);
          await page.waitFor(2 * dateUtils.SECOND);
          if (retriesInARow >= 2) {
            throw `Too many unsuccessful attempts to process entity (${entityName}). Giving up.`;
          }
          retriesInARow++;
        }

        try {
          this.log("Closing tab with entity");
          await pageActions.closeEntityTab(page);
          await page.waitFor(dateUtils.SECOND);
        } catch (e) {
          this.log(
            "Error appeared while closing tab. Most likely it means that page crushed. " +
              e.toString()
          );
          page = await auth.continueInNewPage(page, url, this.browser);
        }
      }

      // logging out of the system
      this.log("Logging out of the system");
      await page.waitFor(dateUtils.SECOND);
      await auth.logout(page);
      await page.waitFor(dateUtils.SECOND);
      await this.browser.close();

      this.log("Crawler's job is done.");
    } catch (e) {
      this.log("Fatal error: " + e.toString());
      await this.browser.close();
      this.exceptionText = e.toString();
    }
    callback(this.exceptionText);
  })();
};

module.exports = Stick;
