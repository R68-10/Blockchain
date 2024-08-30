
// @author: RaghadAlrefaei 


// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// here we import ERC20 and Ownable form Openzeppelin auditing org. for smart contracts
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingSystem is ERC20, Ownable {
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    
    // created event that like trigger or notify the owner 
    event ProposalApproved(
        uint proposalId,
        string description, 
        uint256 yesVotes,
        uint256 noVotes
    );

    // to implement the ERC20 standard 
    constructor() ERC20("VoteToken", "RMA") Ownable(msg.sender) {}

    // to initaliz the variables   
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        bool isApproved; 
        mapping (address => bool) hasVoted;
    }

    // fucntion to submit the propsal 
    function submitProposal(string memory description) public {
        proposalCount++;

        // object to create new proposal 
        Proposal storage newProposal = proposals[proposalCount];
        newProposal.id = proposalCount;
        newProposal.proposer = msg.sender;
        newProposal.description = description;
        newProposal.yesVotes = 0;
        newProposal.noVotes = 0;
    }

    // mint function used to create new tokens 
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // function to allow voting  
    function vote(uint256 proposalId, bool isYes) public {
        Proposal storage proposal = proposals[proposalId];     
        require(balanceOf(msg.sender) > 0, "You must have tokens");
        require(proposal.hasVoted[msg.sender] == false, "Already Voted");
        proposal.hasVoted[msg.sender] = true;
        uint256 requiredVotes = 5;

        if (isYes) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }

        if (proposal.yesVotes >= requiredVotes) {
            if (proposal.yesVotes > proposal.noVotes) {
                proposal.isApproved = true; 
                emit ProposalApproved(proposalId, proposal.description, proposal.yesVotes, proposal.noVotes);
        }
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


