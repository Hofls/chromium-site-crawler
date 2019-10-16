const Stick = require("./stick");
const auth = require("./auth");
const fileInput = require("./file-input");
const FileOutput = require("../src/file-output");
const archivator = require("./archivator");

let sticks = [];
let entityNames = [];
let threadsDone = 0;
let exceptionText = "";

let emergencyStop = function() {
  for (let stick of sticks) {
    stick.emergencyStop();
  }
};

let getProgressPart = function() {
  let totalProgress = {
    processedCount: 0,
    totalCount: 0,
    exception: exceptionText,
    workInProgress: workInProgress()
  };
  for (let stick of sticks) {
    let localProgress = stick.getProgress();
    totalProgress.processedCount += localProgress.processedCount;
    totalProgress.totalCount += localProgress.totalCount;
    if (localProgress.exception) {
      totalProgress.exception += " | " + localProgress.exception;
    }
  }
  return totalProgress;
};

let workInProgress = function() {
  return sticks.length !== threadsDone;
};

/**
 * Returns time left (in minutes)
 */
let calculateRemainingTime = function(
  threadsCount,
  processedCount,
  totalCount
) {
  let secondsPerEntity = 16;
  let secondsPerEntityTotal = secondsPerEntity / threadsCount;
  let entitiesRemaining = totalCount - processedCount;
  let minutes = (entitiesRemaining * secondsPerEntityTotal) / 60;
  return Math.ceil(minutes);
};
/**
 * Threads control (1 thread = 1 browser)
 */
module.exports = {
  emergencyStop,
  calculateRemainingTime,
  /**
   * Launches multiple threads
   */
  launch: function(inputFilePath, regime) {
    sticks = [];
    threadsDone = 0;
    exceptionText = "";

    /** called when thread is done */
    function callback(exception) {
      if (exception) {
        emergencyStop();
      }
      threadsDone++;
      console.log("Thread done (" + threadsDone + " / " + sticks.length + ")");
      if (!workInProgress()) {
        archivator.archivate(archivator.getFilesList(regime), function() {});
      }
    }

    try {
      let rangeOutput = new FileOutput(archivator.RANGES_FILE_NAME);
      rangeOutput.createNewFile();
      rangeOutput.appendLine("№", "Start", "End");
      let userOutput = new FileOutput(archivator.USERS_FILE_NAME);
      userOutput.createNewFile();
      userOutput.appendLine("№", "User");

      let credentials = auth.getCredentials();
      entityNames = fileInput.readFile(inputFilePath);
      let entitiesPerThread = this.distributeEntities(
        entityNames,
        credentials.length
      );

      for (let i in credentials) {
        if (entitiesPerThread[i]) {
          let stick = new Stick(credentials[i].login);
          stick.launch(
            inputFilePath,
            credentials[i],
            entitiesPerThread[i],
            rangeOutput,
            userOutput,
            callback
          );
          sticks.push(stick);
        }
      }
    } catch (e) {
      console.log(e);
      exceptionText = e.toString();
    }
  },
  /**
   * Distributes entities in threads
   */
  distributeEntities(entityNames, maxThreadsCount) {
    let entitiesPerThread = {};

    for (let i in entityNames) {
      let currentThread = i % maxThreadsCount;
      if (!entitiesPerThread[currentThread]) {
        entitiesPerThread[currentThread] = [];
      }
      entitiesPerThread[currentThread].push(entityNames[i]);
    }
    return entitiesPerThread;
  },
  /**
   * Returns work progress
   */
  getProgress: function() {
    let progress = getProgressPart();
    progress.remainingTime = calculateRemainingTime(
      sticks.length,
      progress.processedCount,
      progress.totalCount
    );
    return progress;
  }
};

process.on("unhandledRejection", (r, promise) => {
  let reason = r;
  if (!reason) {
    reason = "Unknown reason";
  }
  console.log(
    "Promise rejected:",
    reason || " " || reason.stack || " " || promise
  );
});
