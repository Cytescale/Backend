require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const parser = require("ua-parser-js");
const { exec } = require("child_process");
const { DBHelper } = require("../supabase/dbHelper");

const router = express.Router({
  caseSensitive: false,
  strict: true,
});

const corsOptions = {
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

class Server {
  constructor(supaclient, dbhelper) {
    this.supaclient = supaclient;
    this.dbhelper = dbhelper;
    this.app = express();
    this.server_init(this.app);
    this.shutdown_handlers();
    const router = new Router(this.app, this.supaclient, this.dbhelper);
  }

  setup_routes(app) {
    app.post("/githook", async (req, res, next) => {
      console.log("🤖 Git update pushed");
      exec(
        `
      cd /home/ubuntu/Backend/ && 
      git stash && 
      git pull &&
      npm install &&
      pm2 restart Backend`,
        (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        }
      );
      res.send("Project rebuild response").status(200).end();
      next();
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

const ServerResponse = (responseData, errorBool, errorMessage, statusCode) => {
  if (errorBool) {
    return {
      errorBool: errorBool,
      errorMessage: errorMessage,
      response: null,
      status: statusCode ? statusCode : 600,
      timestamp: Date.now(),
    };
  } else {
    return {
      errorBool: false,
      errorMessage: null,
      response: responseData,
      status: statusCode ? statusCode : 600,
      timestamp: Date.now(),
    };
  }
};

class Router {
  constructor(app, supaclient, dbhelper) {
    this.supaclient = supaclient;
    this.dbhelper = dbhelper;
    this.app = app;
    this.routes_start(this.app);
  }

  routes_start(app) {
    app.get("/check", (req, res, next) => {
      console.log("✔️ Server Check");
      res.send("Hello World 👋");
      next();
    });

    app.get("/api/v1/getUserData", async (req, res, next) => {
      const uid = req.query.uid;
      try {
        if (!uid) throw "No uid supplied";
        const dbRes = await this.dbhelper.getUserData(uid);
        if (dbRes.errorBool) throw dbRes.errorMessage;
        if (dbRes.response)
          res.send(ServerResponse(dbRes.response, false, null, 200)).end();
      } catch (e) {
        res.send(ServerResponse(null, true, e, 200)).end();
      }
      next();
    });

    app.get("/api/v1/getRecordDataByRID", async (req, res, next) => {
      const rid = req.query.rid;
      try {
        if (!rid) throw "No uid supplied";
        const dbRes = await this.dbhelper.getRecordbyRID(rid);
        if (dbRes.errorBool) throw dbRes.errorMessage;
        if (dbRes.response)
          res.send(ServerResponse(dbRes.response, false, null, 200)).end();
      } catch (e) {
        res.send(ServerResponse(null, true, e, 200)).end();
      }
      next();
    });

    app.post("/api/v1/updateUserData", (req, res, next) => {
      next();
    });
  }
}

module.exports = { Server };
