const { Server } = require("./server");
const { SupaHelper } = require("./supabase/superHelper");
const { DBHelper } = require("./supabase/dbHelper");
const { transationMain } = require("./blockchain/transactionHelper");

transationMain();

const server = new Server();
const supa = new SupaHelper();
const dbhelp = new DBHelper(supa.getClient());
