var CappuToken = artifacts.require("./CappuToken.sol");
var MyTokenSale = artifacts.require("./MyTokenSale.sol");
var MyKyc = artifacts.require("./KycContract.sol");
require("dotenv").config({path:"../.env"});

module.exports = async function(deployer) {
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(CappuToken, process.env.INITIAL_TOKENS);
    await deployer.deploy(MyKyc);
    await deployer.deploy(MyTokenSale, 1, addr[0], CappuToken.address, MyKyc.address);
    let instance = await CappuToken.deployed();
    await instance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS);
};


// var MyToken = artifacts.require("./CappuToken.sol");
// var MyTokenSales = artifacts.require("./MyTokenSale.sol");

// module.exports = async function(deployer) {
//     let addr = await web3.eth.getAccounts();
//     await deployer.deploy(MyToken, 1000000000);
//     await deployer.deploy(MyTokenSales, 1, addr[0], MyToken.address);
//     let tokenInstance = await MyToken.deployed();
//     await tokenInstance.transfer(MyTokenSales.address, 1000000000);

// };