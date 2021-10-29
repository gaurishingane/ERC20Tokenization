const TokenSale = artifacts.require("MyTokenSale");
const Token = artifacts.require("CappuToken");
const KycContract = artifacts.require("KycContract");
 
 
const exp = require("constants");
const chai = require("./chaiSetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;
 
require("dotenv").config({path: "../.env"});
 
contract("TokenSale Test", async (accounts) => {
 
    const [deployerAccount, recipient, anotherAccount] = accounts;
 
    it('should not have any tokens in my deployerAccount', async () =>{
        let instance = await Token.deployed();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
 
    });

    it("TokenSale contract has all tokens by default", async() => {
        let instance = await Token.deployed();
        let balanceOfTokenSaleContract = await instance.balanceOf(TokenSale.address);
        let totalSupply = await instance.totalSupply();
        return expect(balanceOfTokenSaleContract).to.be.a.bignumber.equals(totalSupply);
    });

    it("should be possible to buy tokens", async() => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let kycInstance = await KycContract.deployed();
        let balanceBefore = await tokenInstance.balanceOf.call(deployerAccount);
        await kycInstance.setKycCompleted(deployerAccount, {from:deployerAccount});
        await expect(tokenSaleInstance.sendTransaction({ from: deployerAccount, value: web3.utils.toWei("1", "Wei")})).to.be.fulfilled;
        return expect(balanceBefore + 1).to.be.bignumber.equal(await tokenInstance.balanceOf.call(deployerAccount));
    });
});