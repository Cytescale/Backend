const { Server } = require("./server");
const { SupaHelper } = require("./supabase/superHelper");
const { DBHelper } = require("./supabase/dbHelper");
const {
  setRecord,
  decodeTxn,
  getRecordByTxn,
  recordDataByTxn,
} = require("./blockchain/transactionHelper");

let data = "0xa4bc09c6a1b6322969d3deb8ab7cf3036c5b99172ac13a68dfe44cd2fdcd586d";
//t1 = 0xa4bc09c6a1b6322969d3deb8ab7cf3036c5b99172ac13a68dfe44cd2fdcd586d
//t2 = 0xdf6723244b25e0ad455f86af9fe4bf419d317d7426588830f5d71e1cb6489753
//t3 = 0xba3b3e56efba16d25f8e35b02624523c0a2eccaf96023984c253f07ec12947d4
//t4 = lost
//t5 = 0x8230329c536a1e6f1aadc157dd6f9524c84b47a5081881b8a5cb081455196f02

// setRecord("creatoruid4", "patientuid4", "treat6", [
//   "treat12",
//   "treat13",
//   "treat14",
//   "treat16",
// ])
//   .then((r) => console.log(r.response.hash))
//   .catch((e) => console.log(e));

getRecordByTxn(data)
  .then((r) => {
    console.log(r);
  })
  .catch((e) => {
    console.log(e);
  });

const server = new Server();
const supa = new SupaHelper();
const dbhelp = new DBHelper(supa.getClient());
