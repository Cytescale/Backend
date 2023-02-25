require("dotenv").config();
const { ethers } = require("ethers");
const { ABI } = require("./ERC20");
const contractAddress = "0x7ef0bc63e77a27c96a3788fd1ce9d431c577ccae";

const func = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.NODE_PROVIDER);
  const wall = new ethers.Wallet(process.env.WALLET_PVT_KEY, provider);
  const contract = new ethers.Contract(contractAddress, ABI, wall);
  const storeRes = await contract.store(200);
  const result = await contract.retrieve();
  console.log(result);
};

function transationMain() {
  func();
}

module.exports = { transationMain };
