
const CollegeElection = artifacts.require("CollegeElection");

module.exports = function (deployer) {
  deployer.deploy(CollegeElection);
};
