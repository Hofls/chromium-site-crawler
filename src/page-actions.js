const dateUtils = require("./date-utils");

let DELAY_MS = 200;

/**
 * All the possible actions on the page (text input, element pick, click, etc)
 */
module.exports = {
  DELAY_MS,

  press: function(page, elem, button) {
    return (async () => {
      await elem.press(button);
      await page.waitFor(this.DELAY_MS * 2);
      await this.waitUntilLoadingStops(page);
    })();
  },

  type: function(page, elem, text) {
    return (async () => {
      await elem.type(text);
      await page.waitFor(this.DELAY_MS);
    })();
  },

  click: function(page, elem) {
    return (async () => {
      await elem.click();
      await page.waitFor(this.DELAY_MS * 2);
      await this.waitUntilLoadingStops(page);
    })();
  },

  closeEntityTab: function(page, retry = true) {
    return (async () => {
      try {
        await page.waitFor(this.DELAY_MS);
        let icons = await this.getAllWhenXpathAppears(
          page,
          "//a[@class='x-tab-strip-close']"
        );
        let closeIcon = icons[1];
        if (closeIcon) {
          await this.click(page, closeIcon);
        }
      } catch (e) {
        if (retry) {
          console.log("CLOSE TAB. RETRYING. " + e);
          await page.waitFor(this.DELAY_MS * 4);
          await this.closeEntityTab(page, false);
        } else {
          throw e;
        }
      }
    })();
  },

  /**
   * Click on element found with xpath selector
   */
  clickXpath: function(page, xpathSelector, retry = true) {
    return (async () => {
      try {
        const elem = await this.getWhenXpathAppears(page, xpathSelector);
        await this.click(page, elem);
      } catch (e) {
        if (retry) {
          console.log("CLICK XPATH. RETRYING. " + e);
          await page.waitFor(this.DELAY_MS * 4);
          await this.clickXpath(page, xpathSelector, false);
        } else {
          throw e;
        }
      }
    })();
  },

  /**
   * Enter text in element found with xpath selector
   */
  typeXpath: function(page, xpathSelector, text) {
    return (async () => {
      const elem = await this.getWhenXpathAppears(page, xpathSelector);
      await this.type(page, elem, text);
      return elem;
    })();
  },

  /**
   * Waits for page load to end. (when loading indicator disappears)
   */
  waitUntilLoadingStops: function(page) {
    return (async () => {
      await this.waitUntilElementNotFound(
        page,
        "//div[contains(@class, 'x-mask-loading')]"
      );
    })();
  },

  /**
   * Looks for input linked with label through xpath selector
   */
  findInputByLabelXpath: function(page, xpathLabelSelector) {
    return (async () => {
      const label = await this.getWhenXpathAppears(page, xpathLabelSelector);
      let inputId = await (await label.getProperty("htmlFor")).jsonValue();
      const input = await this.getWhenXpathAppears(
        page,
        `//input[@id='${inputId}']`
      );
      return input;
    })();
  },

  /**
   * Waits for element to appear (xpath) on the page and returns it
   */
  getWhenXpathAppears: function(
    page,
    xpathSelector,
    timeoutMs = 6 * dateUtils.SECOND
  ) {
    return (async () => {
      function searchSingleElement(frame, xpathSelector) {
        return (async () => {
          try {
            return await frame.waitForXPath(xpathSelector, { timeout: 8 });
          } catch (ignore) {
            //
          }
        })();
      }

      return this.waitUntilSearchSucceeds(
        page,
        xpathSelector,
        searchSingleElement,
        timeoutMs
      );
    })();
  },

  /**
   * Waits for array of elements (xpath) to appear on the page, then returns them
   */
  getAllWhenXpathAppears: function(
    page,
    xpathSelector,
    timeoutMs = 6 * dateUtils.SECOND,
    delay = true
  ) {
    return (async () => {
      function searchAllElements(frame, xpathSelector, delay) {
        return (async () => {
          let elem;
          try {
            elem = await frame.waitForXPath(xpathSelector, { timeout: 8 });
          } catch (e) {
            //
          }
          if (elem) {
            // wait for all elements to appear
            if (delay) await page.waitFor(250);
            const elementsUpd = await frame.$x(xpathSelector);
            return elementsUpd;
          }
          return undefined;
        })();
      }

      return this.waitUntilSearchSucceeds(
        page,
        xpathSelector,
        searchAllElements,
        timeoutMs,
        delay
      );
    })();
  },

  /**
   * Calls function search(frame, xpathSelector) until it returns result, or timeout happens (timeoutMs)
   */
  waitUntilSearchSucceeds: function(
    page,
    xpathSelector,
    search,
    timeoutMs,
    delay = true
  ) {
    return (async () => {
      let startTime = new Date();
      let currentTime = new Date();
      while (currentTime - startTime < timeoutMs) {
        currentTime = new Date();
        let frames = await page.frames();
        for (let frame of frames) {
          if (frame.isDetached()) {
            continue;
          }
          let result = await search(frame, xpathSelector, delay);
          if (result) {
            if (delay) await page.waitFor(this.DELAY_MS); // element found in html, but not ready for interaction, need to wait a little more (Error: Node is either not visible or not an HTMLElement)
            return result;
          }
        }
        await page.waitFor(this.DELAY_MS);
      }
      throw `Element ${xpathSelector} not found in ${timeoutMs} ms`;
    })();
  },

  /**
   * Looks for element xpathSelector until it disappears
   * (e.g. wait for load indicator to disappear)
   */
  waitUntilElementNotFound: function(
    page,
    xpathSelector,
    timeoutMs = 8 * dateUtils.SECOND
  ) {
    return (async () => {
      let startTime = new Date();
      let currentTime = new Date();
      while (currentTime - startTime < timeoutMs) {
        currentTime = new Date();
        let frames = await page.frames();
        let elementFound = false;
        for (let frame of frames) {
          if (frame.isDetached()) {
            continue;
          }
          let elem;
          try {
            elem = await frame.waitForXPath(xpathSelector, { timeout: 8 });
          } catch (e) {
            //
          }
          if (elem) {
            let result = (await frame.$x(xpathSelector))[0];
            if (result) {
              elementFound = true;
            }
          }
        }
        if (!elementFound) {
          return;
        }
        await page.waitFor(this.DELAY_MS);
      }
      throw `Element ${xpathSelector} did not disappeared in ${timeoutMs} ms`;
    })();
  },

  /**
   * Click on element (css selector) and wait for page to load
   */
  clickAndWait: function(page, cssSelector) {
    return Promise.all([page.waitForNavigation(), page.click(cssSelector)]);
  },

  typeTextInTextEditor: function(page, text) {
    return (async () => {
      var frame = await page.frames()[1];
      let bodyInput = await frame.$("body");
      await bodyInput.type(text);
      const replyText = await frame.evaluate(() => {
        return document.querySelector("body").innerHTML;
      });
      console.log(replyText);
    })();
  }
};
