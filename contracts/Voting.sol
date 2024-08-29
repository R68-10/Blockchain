// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzepplin/contracts/token/ERC20/ERC20.sol";
import "@openzepplin/contracts/access/Ownable.sol";


contract VotingSystem {
    uint256 public proposalCount; 

    constrctor() ERC20("VoteToken", "RMA") Ownable(msg.sender) {}

    struct Proposal {
        uint256 id;
        address propser;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        mapping (address => bool) hasVoted;
    }

    mapping(uint256 => Proposal) public Proposals; 

}

// make sure anyone do have token only making voting, 
// token is the identity of the token, 
// also check if the this person has made token or not 

