const express = require("express");
const multithreadStick = require("./multithread");
const multer = require("multer");
const archivator = require("./archivator");
const fs = require("fs");

const upload = multer({
  dest: "src/uploads/"
});

let server;

/**
 * Local server
 */
module.exports = {
  /**
   * Launch server
   */
  run: function() {
    const htmlFolder = __dirname + "/html";
    const workInProgressPage = htmlFolder + "/work_in_progress.html";
    const tooLatePage = htmlFolder + "/too_late.html";
    const fileUploadPage = htmlFolder + "/file_upload.html";
    const expressModule = express();

    expressModule.use(express.static(htmlFolder));
    expressModule.use(function(req, res, next) {
      res.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate"
      );
      res.header("Expires", "-1");
      res.header("Pragma", "no-cache");
      next();
    });

    expressModule.get("/stick", (req, res) => {
      if (multithreadStick.getProgress().workInProgress) {
        res.sendFile(workInProgressPage);
      } else {
        res.sendFile(fileUploadPage);
      }
    });

    expressModule.get("/stop", (req, res) => {
      multithreadStick.emergencyStop();
      res.send("OK");
    });

    expressModule.post("/launch", upload.single("myfile"), (req, res) => {
      if (multithreadStick.getProgress().workInProgress) {
        res.sendFile(tooLatePage);
      } else {
        multithreadStick.launch(req.file.path, req.body.regime_name);
        res.sendFile(workInProgressPage);
      }
    });

    expressModule.get("/getProgress", (req, res) => {
      res.send(multithreadStick.getProgress());
    });

    expressModule.get("/downloadArchive", (req, res) => {
      if (fs.existsSync(archivator.DEFAULT_ARCHIVE_NAME)) {
        res.download(archivator.DEFAULT_ARCHIVE_NAME);
      } else {
        res.send("Archive not found");
      }
    });

    expressModule.get("/health", (req, res) => {
      res.send("OK");
    });

    server = expressModule.listen(8080, () =>
      console.log("Server started successfully.")
    );
  },

  stop: function() {
    server.close();
  }
};
