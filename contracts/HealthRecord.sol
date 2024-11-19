// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthRecord {
    struct Record {
        string dataHash; // Hash of the medical data
        address patient; // Patient address
    }

    mapping(address => Record) private records;
    mapping(address => mapping(address => bool)) private authorizedAccess;

    function createRecord(string memory _dataHash) public {
        require(bytes(records[msg.sender].dataHash).length == 0, "Record already exists.");
        records[msg.sender] = Record(_dataHash, msg.sender);
    }

    function authorizeAccess(address _provider) public {
        require(msg.sender == records[msg.sender].patient, "Only the patient can authorize access.");
        authorizedAccess[msg.sender][_provider] = true;
    }

    function revokeAccess(address _provider) public {
        require(msg.sender == records[msg.sender].patient, "Only the patient can revoke access.");
        authorizedAccess[msg.sender][_provider] = false;
    }

    function getRecord() public view returns (string memory) {
        require(
            records[msg.sender].patient == msg.sender || authorizedAccess[records[msg.sender].patient][msg.sender],
            "Unauthorized access."
        );
        return records[msg.sender].dataHash;
    }
}
