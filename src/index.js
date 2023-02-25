const express = require("express");
const cors = require("cors");
const { request } = require("http");
const { exit } = require("process");
const bodyParser = require("body-parser");
const parser = require("ua-parser-js");
const { exec } = require("child_process");
const axios = require("axios").default;
const { createClient } = require("@supabase/supabase-js");
const { SupaHelper } = require("./superHelper");
const { DBHelper } = require("./dbHelper");
const { transationMain } = require("./transactionHelper");
const router = express.Router({
  caseSensitive: false,
  strict: true,
});
const port = 3000;
const corsOptions = {
  optionsSuccessStatus: 200,
  preflightContinue: false,
};

transationMain();

// const supa = new SupaHelper();
// const dbhelp = new DBHelper(supa.getClient());

const app = express();
router.use(require("express-status-monitor")());
app.use(express.static(__dirname));
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on("SIGINT", () => {
  console.warn("PROCESS AT END");
});
process.once("SIGUSR2", function () {
  console.warn("GRACE SHUTDOWN");
});
process.on("exit", function (code) {
  console.log("Server shutdown ");
  console.warn("About to exit with code:", code);
});
