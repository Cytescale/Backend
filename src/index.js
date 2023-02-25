const { Server } = require("./server");
const { SupaHelper } = require("./supabase/superHelper");
const { DBHelper } = require("./supabase/dbHelper");
const { transationMain } = require("./blockchain/transactionHelper");
const log4js = require("log4js");
log4js.configure({
  appenders: { dev: { type: "file", filename: "./logs/dev.logs" } },
  categories: { default: { appenders: ["dev"], level: "error" } },
});


///const server = new Server();
transationMain();
const supa = new SupaHelper();
const dbhelp = new DBHelper(supa.getClient());
