pragma solidity >=0.5.16;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProposalContract.sol";

contract TestHelloWorld {
    function testItGreets() public {
        // Get the deployed contract
        ProposalContract helloWorld = ProposalContract();

        // Call getGreeting function in deployed contract
        uint amount = web3.eth.getBalance(helloWorld);
        // Assert that the function returns the correct greeting
        Assert.equal(amount, 3);
    }
}