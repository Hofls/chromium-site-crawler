const assert = require("assert");
const calc = require("../src/calc");

describe("auth", function() {
  it("should calculate ranges", async () => {
    let rows = [];

    rows.push({ newValue: "New", date: "30/04/19 14:11:30" });
    rows.push({
      newValue: "Information provided",
      date: "30/04/19 14:12:30"
    });

    // start
    rows.push({
      newValue: "Extra info request",
      user: "Ivanov Pyotr Semenovich_2331231",
      date: "30/04/19 14:13:30"
    });
    rows.push({ newValue: "In progress", date: "30/04/19 14:14:30" });
    rows.push({ newValue: "Not registered", date: "30/04/19 14:15:30" });
    rows.push({
      newValue: "Information provided",
      date: "30/04/19 14:16:30"
    });
    // end

    rows.push({ newValue: "Control", date: "30/04/19 14:17:30" });
    rows.push({
      newValue: "Information provided",
      date: "30/04/19 14:18:30"
    });

    // start
    rows.push({
      newValue: "Extra info request",
      user: "Sergeev Alexei Valeryevich_2331231",
      date: "30/04/19 14:19:30"
    });
    rows.push({
      newValue: "Registered",
      date: "30/04/19 14:20:30"
    });
    // end

    // start
    rows.push({
      newValue: "Extra info request",
      user: "Petrov Valeriy Inatevich_4443311",
      date: "30/04/19 14:21:30"
    });
    rows.push({ newValue: "Not registered", date: "30/04/19 14:22:30" });
    rows.push({ newValue: "Done", date: "30/04/19 14:23:30" });
    // end

    // start
    rows.push({
      newValue: "Done",
      user: "Petrov Valeryi Petrovich_23111",
      date: "30/04/19 14:23:35"
    });
    rows.push({
      newValue: "Done",
      user: "Ivanko Ivan Petrovic_23111",
      date: "30/04/19 14:23:40"
    });
    rows.push({
      newValue: "Extra info request",
      user: "Petrov Valeriy Inatevich_4443311",
      date: "30/04/19 14:23:45"
    });
    rows.push({
      newValue: "Registered",
      user: "Ivanko Ivan Petrovic_23111",
      date: "30/04/19 14:23:50"
    });
    // end

    rows.push({
      newValue: "Registered",
      user: "Limonov Semyon Valeryevich_7423712",
      date: "30/04/19 14:24:30"
    });
    rows.push({
      newValue: "Extra info request",
      user: "Ivanov Pyotr Semenovich_2331231",

      date: "30/04/19 14:25:30"
    });

    let ranges = await calc.calculateRanges(rows);
    assert.equal(4, ranges.length);
    assert.equal("30/04/19 14:13:30", ranges[0].start);
    assert.equal("30/04/19 14:16:30", ranges[0].end);
    assert.equal("30/04/19 14:19:30", ranges[1].start);
    assert.equal("30/04/19 14:20:30", ranges[1].end);
    assert.equal("30/04/19 14:21:30", ranges[2].start);
    assert.equal("30/04/19 14:23:30", ranges[2].end);
    assert.equal("30/04/19 14:23:35", ranges[3].start);
    assert.equal("30/04/19 14:23:50", ranges[3].end);

    let users = await calc.findUsersWhoRequested(rows);
    assert.equal(5, users.length);
    assert.equal("Ivanov Pyotr Semenovich_2331231", users[0].user);
    assert.equal("Sergeev Alexei Valeryevich_2331231", users[1].user);
    assert.equal("Petrov Valeriy Inatevich_4443311", users[2].user);
    assert.equal("Petrov Valeriy Inatevich_4443311", users[3].user);
    assert.equal("Ivanov Pyotr Semenovich_2331231", users[4].user);
  });
});
