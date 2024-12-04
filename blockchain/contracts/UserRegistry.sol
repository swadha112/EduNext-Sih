// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract UserRegistry {
    struct User {
        string emailHash;
        string metadata;
    }

    mapping(address => User) public users;

    event UserRegistered(address indexed user, string emailHash);

    function registerUser(string memory emailHash, string memory metadata) public {
        require(bytes(users[msg.sender].emailHash).length == 0, "User already registered");
        users[msg.sender] = User(emailHash, metadata);
        emit UserRegistered(msg.sender, emailHash);
    }

    function getUser(address user) public view returns (User memory) {
        return users[user];
    }
}