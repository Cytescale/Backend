require("dotenv").config();
const { ethers } = require("ethers");
const { ABI } = require("./ERC20");
const { MRepsonse } = require("../supabase/superHelper");
const contractAddress = "0x3FA39F96Da9f7A0648d0b2764BBefb8031D6838E";

const setRecord = async (creatorUID, patientUID, treatID, medArr) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.NODE_PROVIDER);
    const wall = new ethers.Wallet(process.env.WALLET_PVT_KEY, provider);
    const contract = new ethers.Contract(contractAddress, ABI, wall);
    const storeRes = await contract.setRecord(
      creatorUID,
      patientUID,
      treatID,
      medArr
    );
    return MRepsonse(storeRes, false, null);
    
  } catch (e) {
    return MRepsonse(null, true, e);
  }
};

const getRecordByTxn = async (num) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.NODE_PROVIDER);
    let result = await provider.getTransaction(num);
    return MRepsonse(result, false, null);
  } catch (e) {
    return MRepsonse(null, true, e);
  }
};

const decodeTxn = async (txn) => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.NODE_PROVIDER);
    const inter = new ethers.Interface(ABI);
    const tx = await provider.getTransaction(txn);
    const decodedInput = inter.parseTransaction({
      data: tx.data,
      value: tx.value,
    });

    return MRepsonse(decodedInput.args, false, null);
  } catch (e) {
    return MRepsonse(null, true, e);
  }
};

const recordDataByTxn = async (txn) => {
  try {
    const addChk = ethers.isAddress(txn);
    console.log(addChk);
    let raw_res = await decodeTxn(txn);
    if (raw_res.errorBool) throw raw_res.errorMessage;
    return MRepsonse(
      {
        creator_uid: raw_res.response[0],
        patient_uid: raw_res.response[1],
        treat_id: raw_res.response[2],
        med_arr: raw_res.response[3],
      },
      false,
      null
    );
  } catch (e) {
    return MRepsonse(null, true, e);
  }
};

module.exports = {
  setRecord,
  getRecordByTxn,
  decodeTxn,
  recordDataByTxn,
};
