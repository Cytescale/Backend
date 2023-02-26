// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract RecordStorage {

    string[] medArr;
    string creatorUID;
    string patientUID;
    string treatID;

    function setRecord(
        string memory  _creatorUID,
        string memory  _patientUID,
        string memory  _treatID,
        string[] memory _medArr
        ) public{
        medArr = _medArr;
        creatorUID = _creatorUID;
        patientUID = _patientUID;
        treatID = _treatID;
    }
    

    function getRecord() view public returns(string memory, string memory , string memory ,string[] memory){
        return (creatorUID,patientUID,treatID,medArr);
    }
}