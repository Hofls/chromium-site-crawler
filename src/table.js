const pageActions = require("./page-actions");
const dateUtils = require("./date-utils");

module.exports = {
  readHistoryTable: function(page) {
    return (async () => {
      await pageActions.getWhenXpathAppears(
        page,
        "//*/text()[normalize-space(.) = 'Status']/parent::a"
      );
      // rows finally appeared, proceeding:
      let tableRows = [];
      let newValues = await pageActions.getAllWhenXpathAppears(
        page,
        "//div[@class='x-grid3-cell-inner x-grid3-col-2 x-unselectable ']"
      );
      let users = await pageActions.getAllWhenXpathAppears(
        page,
        "//div[@class='x-grid3-cell-inner x-grid3-col-3 x-unselectable ']",
        6 * dateUtils.SECOND,
        false
      );
      let dates = await pageActions.getAllWhenXpathAppears(
        page,
        "//div[@class='x-grid3-cell-inner x-grid3-col-4 x-unselectable ']",
        6 * dateUtils.SECOND,
        false
      );

      for (let i in newValues) {
        const newValueText = await (await newValues[i].getProperty(
          "innerText"
        )).jsonValue();
        const userValueText = await (await users[i].getProperty(
          "innerText"
        )).jsonValue();
        const dateValueText = await (await dates[i].getProperty(
          "innerText"
        )).jsonValue();
        tableRows.unshift({
          newValue: newValueText.trim(),
          user: userValueText.trim(),
          date: dateValueText.trim()
        });
      }
      return tableRows;
    })();
  }
};
