const fs = require("node:fs");
const { Server } = require("./server");
const { SupaHelper } = require("./supabase/superHelper");
const { DBHelper } = require("./supabase/dbHelper");
const {
  setRecord,
  decodeTxn,
  getRecordByTxn,
  recordDataByTxn,
} = require("./blockchain/transactionHelper");

const supa = new SupaHelper();
const dbhelp = new DBHelper(supa.getClient());
const server = new Server(supa, dbhelp);




const localcid = "QmakiiMWLxGQQJpz9JdBYcdHnoFDBBs5WK3rezNdQHNRTc";
async function loadIpfs() {
  const { create } = await import("ipfs-core");
  const node = await create({});
  // const fileAdded = await node.add({
  //   path: "sometest.txt",
  //   content: "thisisa new filetest data",
  // });
  // console.log("Added file:", fileAdded.path, fileAdded.cid);
  const { concat } = await import("uint8arrays/concat");
  let buffer = new Uint8Array(0);
  for await (const buf of node.cat(localcid)) {
    buffer = concat([buffer, buf], buffer.length + buf.length);
  }
  fs.writeFile("./smefile.pdf", buffer, (err) => {
    if (!err) console.log("Data written");
  });
}
