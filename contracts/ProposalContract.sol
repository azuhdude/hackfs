pragma solidity >=0.5.16;

contract ProposalContract {
  struct Proposal {
    address sender;
    uint balance;
    uint status; // 2 = review, 1 = active, 0 = completed
    uint endDateMS; // epoch date for the proposal to be ended automatically
    mapping (address => Solution) solutions;
    Solution[] solutionList;
  }

  struct Solution {
    uint reward;
    uint score;
    uint perf;
    bool disputed;
    string preprocessorAddress;
    string ipfsSolutionAddress;
    address payable owner;
    address payable disputer;
  }

  string[] public proposalList;
  mapping (string => Proposal) public proposals;
  mapping (address => string[]) public solutionsForAddr;

  event ProposalCreated(address from, uint amount, string ipfsDataAddress);
  event ProposalUpdated(address from, uint amount, string ipfsDataAddress);
  event ProposalEnd(address from, uint amount, string ipfsDataAddress);

  constructor() public {
  }

  function _proposalEnded(string memory ipfsDataAddress) private view returns (bool) {
    return block.timestamp * 1000 > proposals[ipfsDataAddress].endDateMS;
  }

  function proposeCreate(string memory ipfsDataAddress, uint endDateMS) public payable {
    require(proposals[ipfsDataAddress].balance == 0, "There is already a proposal for that dataset");
    require(msg.value > 0, "Must stake some amount to create a proposal");

    proposals[ipfsDataAddress].sender = msg.sender;
    proposals[ipfsDataAddress].balance += msg.value;
    proposals[ipfsDataAddress].status = 1;
    proposals[ipfsDataAddress].endDateMS = endDateMS;

    proposalList.push(ipfsDataAddress);

    // Emits the event defined earlier
    emit ProposalCreated(msg.sender, msg.value,  ipfsDataAddress);
  }

  function proposeUpdate(string memory ipfsDataAddress) public payable {
    require(proposals[ipfsDataAddress].balance > 0, "There is not an existing proposal for that dataset");

    proposals[ipfsDataAddress].balance += msg.value;
    emit ProposalUpdated(msg.sender, msg.value, ipfsDataAddress);
  }

  function _proposeEnd(string memory ipfsDataAddress) private {
    _reward(ipfsDataAddress);
    proposals[ipfsDataAddress].status = 0;
  }

  function proposeDateEnd(string memory ipfsDataAddress) public {
    require(proposals[ipfsDataAddress].balance > 0, "There is not an existing proposal for that dataset");
    require(_proposalEnded(ipfsDataAddress), "Proposal is not yet over");
    proposals[ipfsDataAddress].status = 2;
  }

  function proposePayout(string memory ipfsDataAddress) public {
    require(proposals[ipfsDataAddress].balance > 0, "There is not an existing proposal for that dataset");
    require(proposals[ipfsDataAddress].status == 2, "Proposal is not in the waiting period");
    require(block.timestamp * 1000 - proposals[ipfsDataAddress].endDateMS > 30000, "Proposal waiting period is not over");
    _proposeEnd(ipfsDataAddress);
  }

  function solutionCreate(string memory ipfsDataAddress, string memory ipfsSolutionAddress, uint score, string memory preprocessorAddress) public {
    // TODO: validation on IPFS address
    // TODO: ensure bad actors cant submit same model from different addresses, or slightly tweaked model to get more rewards
    require(!_testEmptyString(proposals[ipfsDataAddress].solutions[msg.sender].ipfsSolutionAddress), "A solution already exists for this sender");
    require(proposals[ipfsDataAddress].balance > 0, "There is not an existing proposal for that dataset");
    require(score <= 100, "The score cannot be greater than 100");
    require(!_proposalEnded(ipfsDataAddress), "Proposal has already ended");

  proposals[ipfsDataAddress].solutions[msg.sender].ipfsSolutionAddress = ipfsSolutionAddress;
    proposals[ipfsDataAddress].solutions[msg.sender].preprocessorAddress = preprocessorAddress;
    proposals[ipfsDataAddress].solutions[msg.sender].owner = msg.sender;
    proposals[ipfsDataAddress].solutions[msg.sender].score = score;
    proposals[ipfsDataAddress].solutionList.push(proposals[ipfsDataAddress].solutions[msg.sender]);
    solutionsForAddr[msg.sender].push(ipfsDataAddress);
  }

  function solutionUpdate(string memory ipfsDataAddress, string memory ipfsSolutionAddress) public {
    require(_testEmptyString(proposals[ipfsDataAddress].solutions[msg.sender].ipfsSolutionAddress), "A solution does not exist for this sender");
    proposals[ipfsDataAddress].solutions[msg.sender].ipfsSolutionAddress = ipfsSolutionAddress;
  }

  function solutionEvaluate(string memory ipfsDataAddress, uint score) public {
    require(_testEmptyString(proposals[ipfsDataAddress].solutions[msg.sender].ipfsSolutionAddress), "A solution does not exist for this sender");
    proposals[ipfsDataAddress].solutions[msg.sender].score = score;
  }

  function getSolutionsForAddressLength() public view returns(uint) {
    return solutionsForAddr[msg.sender].length;
  }

  function withdraw(string memory ipfsDataAddress) public {
    uint reward = proposals[ipfsDataAddress].solutions[msg.sender].reward;
    proposals[ipfsDataAddress].solutions[msg.sender].reward = 0;
    msg.sender.transfer(reward);
  }

  function getProposalCount() public view returns(uint) {
    return proposalList.length;
  }

  function getProposalSolutionCount(string memory ipfsDataAddress) public view returns(uint) {
    return proposals[ipfsDataAddress].solutionList.length;
  }

  function getProposalSolution(string memory ipfsDataAddress, uint index) public view returns(string memory cid, uint score, address owner, string memory preprocessor, bool disputed) {
    address owner = proposals[ipfsDataAddress].solutionList[index].owner;

    return (
      proposals[ipfsDataAddress].solutions[owner].ipfsSolutionAddress,
      proposals[ipfsDataAddress].solutions[owner].score,
      proposals[ipfsDataAddress].solutions[owner].owner,
      proposals[ipfsDataAddress].solutions[owner].preprocessorAddress,
      proposals[ipfsDataAddress].solutions[owner].disputed
    );
  }

  function _reward(string memory ipfsDataAddress) internal {
    require(proposals[ipfsDataAddress].status == 1, "The proposal is already finished");

    uint maxScore = 0;
    uint totalPerf = 0;

    for (uint i = 0; i < proposals[ipfsDataAddress].solutionList.length; i++) {
      if (proposals[ipfsDataAddress].solutionList[i].score > maxScore) {
        maxScore = proposals[ipfsDataAddress].solutionList[i].score;
      }
    }

    for (uint i = 0; i < proposals[ipfsDataAddress].solutionList.length; i++) {
      proposals[ipfsDataAddress].solutionList[i].perf = proposals[ipfsDataAddress].solutionList[i].score * 1000 / maxScore;
      totalPerf += proposals[ipfsDataAddress].solutionList[i].perf;
    }

    for (uint i = 0; i < proposals[ipfsDataAddress].solutionList.length; i++) {
      uint reward = (proposals[ipfsDataAddress].solutionList[i].perf * proposals[ipfsDataAddress].balance) / totalPerf;
      // "Real" solution used here, since disputer not available in solutionsList
      address owner = proposals[ipfsDataAddress].solutionList[i].owner;
      if (proposals[ipfsDataAddress].solutions[owner].disputer == address(0)) {
        proposals[ipfsDataAddress].solutions[owner].disputer.transfer(reward);
      }
      else {
        proposals[ipfsDataAddress].solutionList[i].owner.transfer(reward);
      }
      proposals[ipfsDataAddress].solutions[proposals[ipfsDataAddress].solutionList[i].owner].reward = reward;
    }
  }

  function disputeSolution(string memory ipfsDataAddress, address ownerAddress) public payable returns(uint) {
    require(_testEmptyString(proposals[ipfsDataAddress].solutions[ownerAddress].ipfsSolutionAddress), "A solution does not exist for this sender");
    require(!proposals[ipfsDataAddress].solutions[ownerAddress].disputed, "This proposal has already been disputed");
    uint gasCost = 10000;
    require(msg.value > gasCost, "Must pay for dispute gas");
    uint disputeWon = uint(uint256(keccak256(abi.encodePacked(now, msg.sender)))%2);

    if (disputeWon == 1) {
      proposals[ipfsDataAddress].solutions[ownerAddress].disputer = msg.sender;
    }

    proposals[ipfsDataAddress].solutions[ownerAddress].disputed = true;

    return disputeWon;
  }

  function getDisputeStatus(string memory ipfsDataAddress, address ownerAddress) public view returns(int) {
    if ( !proposals[ipfsDataAddress].solutions[ownerAddress].disputed) {
      return -1;
    }

    if (proposals[ipfsDataAddress].solutions[ownerAddress].disputer == msg.sender) {
      return 1;
    }

    return 0;
  }

  function _testEmptyString(string memory anyString) pure internal returns(bool) {
    bytes memory tempEmptyStringTest = bytes(anyString); // Uses memory
    if (tempEmptyStringTest.length == 0) {
      return false;
    } else {
      return true;
    }
  }
}
