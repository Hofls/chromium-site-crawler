module.exports = {
  /**
   * Calculates date ranges, when task was on the other side
   */
  calculateRanges: function(rows) {
    let ranges = [];
    let startDate;
    let startValue;
    for (let row of rows) {
      // starting range
      let isStarted =
        row.newValue === "Extra info request" || row.newValue === "Done";
      if (!startDate && isStarted) {
        startDate = row.date;
        startValue = row.newValue;
      }

      // ending range
      let isDone =
        row.newValue === "Information provided" ||
        row.newValue === "Registered";
      let isCompleted = startValue !== "Done" && row.newValue === "Done";
      if (startDate && (isDone || isCompleted)) {
        ranges.push({ start: startDate, end: row.date });
        startDate = null;
      }
    }

    return ranges;
  },

  findUsersWhoRequested: function(rows) {
    let ranges = [];
    for (let row of rows) {
      if (row.newValue === "Extra info request") {
        ranges.push({ user: row.user });
      }
    }

    return ranges;
  }
};
