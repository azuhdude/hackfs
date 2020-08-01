pragma solidity >=0.5.16;

contract ProposalContract {
  address public staker;
  string private message = "Hello World!!!";
  struct Proposal {
    address sender;
    uint balance;
    mapping (address => Solution) solutions;
  }

  struct Solution {
    uint reward;
    string ipfsSolutionAddress;
  }

  string[] public proposalList;
  mapping (string => Proposal) public proposals;

  event ProposalCreated(address from, uint amount, string ipfsDataAddress);
  event ProposalUpdated(address from, uint amount, string ipfsDataAddress);
  event ProposalEnd(address from, uint amount, string ipfsDataAddress);

  constructor() public {
  }

  function getMessage() public view returns(string memory){
    return message;
  }
  function proposeCreate(string memory ipfsDataAddress) public payable {

    require(proposals[ipfsDataAddress].balance == 0, "There is already a proposal for that dataset");
    require(msg.value > 0, "Must stake some amount to create a proposal");
    // TODO: validation on IPFS address

    proposals[ipfsDataAddress].sender = msg.sender;
    proposals[ipfsDataAddress].balance += msg.value;
    proposalList.push(ipfsDataAddress);

    // Emits the event defined earlier
    emit ProposalCreated(msg.sender, msg.value,  ipfsDataAddress);
  }

  function proposeUpdate(string memory ipfsDataAddress) public payable {
    require(proposals[ipfsDataAddress].balance > 0, "There is not an existing proposal for that dataset");

    proposals[ipfsDataAddress].balance += msg.value;
    emit ProposalUpdated(msg.sender, msg.value, ipfsDataAddress);
  }

  function proposeEnd(string memory ipfsDataAddress) public {
    require(msg.sender == proposals[ipfsDataAddress].sender, "Only the owner can end a proposal");
    _reward(ipfsDataAddress);
  }

  function solutionCreate(string memory ipfsDataAddress, string memory ipfsSolutionAddress) public {
    // TODO: validation on IPFS address
    // TODO: ensure bad actors cant submit same model from different addresses, or slightly tweaked model to get more rewards
    require(!_testEmptyString(proposals[ipfsDataAddress].solutions[msg.sender].ipfsSolutionAddress), "A solution already exists for this sender");
    proposals[ipfsDataAddress].solutions[msg.sender].ipfsSolutionAddress = ipfsSolutionAddress;
  }

  function solutionUpdate(string memory ipfsDataAddress, string memory ipfsSolutionAddress) public {
    require(_testEmptyString(proposals[ipfsDataAddress].solutions[msg.sender].ipfsSolutionAddress), "A solution does not exist for this sender");
    proposals[ipfsDataAddress].solutions[msg.sender].ipfsSolutionAddress = ipfsSolutionAddress;
  }

  function withdraw(string memory ipfsDataAddress) public {
    uint reward = proposals[ipfsDataAddress].solutions[msg.sender].reward;
    proposals[ipfsDataAddress].solutions[msg.sender].reward = 0;
    msg.sender.transfer(reward);
  }

  function getProposalCount() public view returns(uint) {
    return proposalList.length;
  }

  function _reward(string memory ipfsDataAddress) internal {
      // TODO: figure out entire reward system
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
