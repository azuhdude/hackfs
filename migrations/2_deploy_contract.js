const instance = artifacts.require("ProposalContract");

module.exports = function(deployer) {
  deployer.deploy(instance);
};