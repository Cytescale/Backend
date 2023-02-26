const ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_creatorUID",
        type: "string",
      },
      {
        internalType: "string",
        name: "_patientUID",
        type: "string",
      },
      {
        internalType: "string",
        name: "_treatID",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "_medArr",
        type: "string[]",
      },
    ],
    name: "setRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getRecord",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
module.exports = { ABI };
