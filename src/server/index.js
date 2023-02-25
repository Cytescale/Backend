require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const parser = require("ua-parser-js");
const { exec } = require("child_process");

const app = express();

const router = express.Router({
  caseSensitive: false,
  strict: true,
});

const corsOptions = {
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

class Server {
  constructor() {
    this.app = express();
    this.server_init(this.app);
    this.shutdown_handlers();
  }

  setup_routes(app) {
    app.get("/check", (req, res) => {
      res.send("Hello World 👋");
    });
  }

  server_init(app) {
    router.use(require("express-status-monitor")());
    app.use(express.static(__dirname));
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(router);
    this.server = app.listen(process.env.PORT, () => {
      console.log(`✔️ Server listening on port ${process.env.PORT}`);
    });
    this.setup_routes(app);
  }

  gracefulShutdownHandler(signal) {
    console.log(`⚠️  Caught ${signal}, gracefully shutting down`);
    setTimeout(() => {
      console.log("🤞 Shutting down application");
      this.server &&
        this.server.close(function () {
          console.log("👋 All requests stopped, shutting down");
          process.exit();
        });
    }, 0);
  }

  shutdown_handlers() {
    process.on("SIGINT", this.gracefulShutdownHandler);
    process.on("SIGTERM", this.gracefulShutdownHandler);
    process.on("exit", function (code) {
      console.log("Server shutdown ");
      console.warn("About to exit with code:", code);
    });
  }
}

module.exports = { Server };
