const fs = require("fs");
const archiver = require("archiver");

const DEFAULT_ARCHIVE_NAME = "result.zip";

const RANGES_FILE_NAME = "Dates.csv";
const USERS_FILE_NAME = "Users.csv";

module.exports = {
  DEFAULT_ARCHIVE_NAME,
  RANGES_FILE_NAME,
  USERS_FILE_NAME,
  /**
   * Adds files to archive
   */
  archivate: function(fileNames, callback) {
    console.log("Archiving files");
    var output = fs.createWriteStream(DEFAULT_ARCHIVE_NAME);
    output.on("close", function() {
      callback(DEFAULT_ARCHIVE_NAME);
    });

    var archive = archiver("zip");
    for (let fileName of fileNames) {
      archive.file(fileName);
    }
    archive.pipe(output);
    archive.finalize();
  },

  getFilesList: function(regime) {
    let files = [];
    if (regime === "default") {
      files = [RANGES_FILE_NAME, USERS_FILE_NAME];
    } else if (regime === "dates") {
      files = [RANGES_FILE_NAME];
    } else if (regime === "users") {
      files = [USERS_FILE_NAME];
    }
    return files;
  }
};
