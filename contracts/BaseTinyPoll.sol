// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseTinyPoll {
    mapping(address => uint8) public latestVote;
    mapping(address => uint256) public userVotes;
    uint256 public buildMoreVotes;
    uint256 public shipFasterVotes;
    uint256 public totalVotes;

    event VoteCast(address indexed user, uint8 vote, uint256 userVotes, uint256 totalVotes);

    function castVote(uint8 vote) external {
        require(vote < 2, "Invalid vote");

        latestVote[msg.sender] = vote;

        unchecked {
            userVotes[msg.sender] += 1;
            totalVotes += 1;

            if (vote == 0) {
                buildMoreVotes += 1;
            } else {
                shipFasterVotes += 1;
            }
        }

        emit VoteCast(msg.sender, vote, userVotes[msg.sender], totalVotes);
    }
}
