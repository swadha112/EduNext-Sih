// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserHashRegistry {
    struct UserHash {
        string dataHash;
        uint256 timestamp;
    }

    mapping(address => UserHash) public userHashes;

    event HashStored(address indexed user, string dataHash);

    function storeHash(string memory _dataHash) public {
        userHashes[msg.sender] = UserHash({
            dataHash: _dataHash,
            timestamp: block.timestamp
        });

        emit HashStored(msg.sender, _dataHash);
    }

    function getHash(address _user) public view returns (string memory, uint256) {
        return (userHashes[_user].dataHash, userHashes[_user].timestamp);
    }
}
