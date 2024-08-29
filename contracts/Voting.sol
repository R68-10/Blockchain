// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingSystem is ERC20, Ownable {
    uint256 public proposalCount;

    constructor() ERC20("VoteToken", "RMA") Ownable(msg.sender) {}

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        bool isApproved; 
        mapping (address => bool) hasVoted;
    }

    mapping(uint256 => Proposal) public proposals;

    function submitProposal(string memory description) public {
        proposalCount++;

        // function te create a new proposal 
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.id = proposalCount;
        newProposal.proposer = msg.sender;
        newProposal.description = description;
        newProposal.yesVotes = 0;
        newProposal.noVotes = 0;
    }

    // mint
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Function to allow voting (need token check) 
    function voting(uint256 proposalId, bool isYes) public {
        Proposal storage proposal = proposals[proposalId];     
        require(balanceOf(msg.sender) > 0, "You must hold tokens to vote");
        require(proposal.hasVoted[msg.sender] = false , "Already Voted");
        proposal.hasVoted[msg.sender] = true;

        if (isYes) {
            proposals[proposalId].yesVotes++;
        } else {
            proposals[proposalId].noVotes++;
        }
    }

    // Function to get proposal details
    function getProposal(uint256 proposalId) public view returns(uint256, address, string memory, uint256, uint256) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.description,
            proposal.yesVotes,
            proposal.noVotes
        );
    }
}


