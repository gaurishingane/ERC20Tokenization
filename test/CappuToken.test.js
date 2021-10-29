const Token = artifacts.require("./CappuToken.sol");

require("dotenv").config({path:"../.env"});

const chai = require("./chaiSetup.js");
const BN = web3.utils.BN;
const expect = chai.expect;

contract("Token Test", async accounts => {

    // get the frst 3 accounts from "accounts" array into 3 diff variables
    const [ initialHolder, recipient, anotherAccount ] = accounts;

    beforeEach(async() => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    });

    // check if all the tokens generated are added to the initialHolder/parent account
    it("All tokens should be in my account", async () => {
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        //old style:
        //let balance = await instance.balanceOf.call(initialHolder);
        //assert.equal(balance.valueOf(), 0, "Account 1 has a balance");
        //condensed, easier readable style:
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    // check if we can successfully send tokens between two accounts
    it("is possible to send tokens between accounts", async() => {
        const sendTokens = 1;
      let instance = this.myToken;
      let totalSupply = await instance.totalSupply();
      await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
      await expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;      
      await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
      return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    });

    it("it can't send more tokens than available in total", async() => {
        let instance = this.myToken;
        let balanceOfAccount = await instance.balanceOf(initialHolder);
        await expect(instance.transfer(recipient, new BN(balanceOfAccount+1))).to.eventually.be.rejected;

        //check if the balance is still the same
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfAccount);
    });

});