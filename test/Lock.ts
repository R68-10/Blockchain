
// @author: RaghadAlrefaei 

// we have 5 test cases to test VotingSystem Smart Contract 
// 1- Should mint and vote
// 2- Don't allow multiple votes from the same address
// 3- Pprevent unauthorized users from voting
// 4- Approve the proposal when the number of yes is grater than 5
// 5- Not accepting the proposal if the number of yes votes does not meet the required 

import { expect } from "chai";
import hre from "hardhat";

describe("Voting", function () {

  //First Test Case:
  //  this test case ensure that the user who have minted and doing voting 
  //  can submitt without any issues
  it("Should mint and vote", async function () {
    const Voting = await hre.ethers.getContractFactory("VotingSystem");
    const voting = await Voting.deploy();
    await voting.waitForDeployment();

    const [owner, Raghad, notVoter] = await hre.ethers.getSigners();

    // minting 100 tokens for user and owner 
    await voting.mint(owner.address, 100);
    await voting.mint(Raghad.address, 100);

    // submiting propsal for owner and user  
    await voting.connect(owner).submitProposal("Proposal 1");
    await voting.connect(Raghad).submitProposal("Proposal 2");

    // submiting voting for owner and user  
    await voting.connect(owner).vote(0, true);
    await voting.connect(Raghad).vote(1, false);

    const proposal1 = await voting.proposals(0);
    const proposal2 = await voting.proposals(1);

    expect(proposal1.yesVotes).to.equal(1);
    expect(proposal1.noVotes).to.equal(0);
    expect(proposal2.yesVotes).to.equal(0);
    expect(proposal2.noVotes).to.equal(1);

  });

//-------------------------------------------------------------------------------------------------------------------------------------

  //Second Test Case:
  //  this test case is to ensure only one address can vote one time 
  it("Don't allow multiple votes from the same address", async function () {
    const Voting = await hre.ethers.getContractFactory("VotingSystem");
    const voting = await Voting.deploy();
    await voting.waitForDeployment();

    const [owner, Raghad] = await hre.ethers.getSigners();

    await voting.mint(owner.address, 100);
    await voting.mint(Raghad.address, 100);

    await voting.connect(owner).submitProposal("Proposal 1");

    // the owner will accept the cvote and not allowing multiple voting 
    await voting.connect(owner).vote(0, true);
    await expect(voting.connect(owner).vote(0, false)).to.be.revertedWith("Already Voted");

    const proposal = await voting.proposals(0);
    expect(proposal.yesVotes).to.equal(1);
    expect(proposal.noVotes).to.equal(0);

  });

//-------------------------------------------------------------------------------------------------------------------------------------

  //Third Test Case:
  //  this test case is restrict to prevent users from voting if they don't have tokens 
  it("Prevent unauthorized users from voting", async function () {
  const Voting = await hre.ethers.getContractFactory("VotingSystem");
  const voting = await Voting.deploy();
  await voting.waitForDeployment();

  const [owner, Raghad, notVoter] = await hre.ethers.getSigners();

  await voting.mint(owner.address, 100);
  await voting.mint(Raghad.address, 100);

  await voting.connect(owner).submitProposal("Proposal 1");

  // this trigger the user with no tokens 
  await expect(voting.connect(notVoter).vote(0, true)).to.be.revertedWith("You must have tokens");

  const proposal = await voting.proposals(0);
  expect(proposal.yesVotes).to.equal(0);
  expect(proposal.noVotes).to.equal(0);

  });

//-------------------------------------------------------------------------------------------------------------------------------------

  //Fourth Test Case:
  //  this test case to ensure that unmer of yes is grater than 5 
  it("Approve the proposal when the number of yes is grater than 5", async function () {
    const Voting = await hre.ethers.getContractFactory("VotingSystem");
    const voting = await Voting.deploy();
    await voting.waitForDeployment();

    // the 5 uses who votes "yes"
    const [owner, Raghad, Mohammed, Rema, Bari] = await hre.ethers.getSigners();

    await voting.mint(owner.address, 100);
    await voting.mint(Raghad.address, 100);
    await voting.mint(Mohammed.address, 100);
    await voting.mint(Rema.address, 100);
    await voting.mint(Bari.address, 100);

    await voting.connect(owner).submitProposal("Proposal 1");

    await voting.connect(owner).vote(0, true);
    await voting.connect(Raghad).vote(0, true);
    await voting.connect(Mohammed).vote(0, true);
    await voting.connect(Rema).vote(0, true);
    await voting.connect(Bari).vote(0, true);

    // to call the proposal and view it 
    const proposal = await voting.getProposal(0);

    expect(proposal[3]).to.equal(5); // Yes votes
    expect(proposal[4]).to.equal(0); // No votes

    // to ensure the proposal is accepted 
    const proposalStruct = await voting.proposals(0);
    expect(proposalStruct.isApproved).to.equal(true);

  });

//-------------------------------------------------------------------------------------------------------------------------------------

  //Fifth Test Case
  // this test case to ensure that the proposal is not approved when the number of yes is less
  it("Not accepting the proposal if the number of yes votes does not meet the required ", async function () {
    const Voting = await hre.ethers.getContractFactory("VotingSystem");
    const voting = await Voting.deploy();
    await voting.waitForDeployment();

    const [owner, Raghad] = await hre.ethers.getSigners();

    await voting.mint(owner.address, 100);
    await voting.mint(Raghad.address, 100);

    await voting.connect(owner).submitProposal("Proposal 1");

    await voting.connect(owner).vote(0, true);

    // to call the proposal and view it 
    const proposal = await voting.proposals(0);

    // if the proposal is not approved
    expect(proposal.yesVotes).to.equal(1);
    expect(proposal.noVotes).to.equal(0);
    expect(proposal.isApproved).to.equal(false);

    // here to Check that no approval event was emitted
    await expect(
        voting.connect(Raghad).vote(0, false)
    ).not.to.emit(voting, 'ProposalApproved');

  });

});


