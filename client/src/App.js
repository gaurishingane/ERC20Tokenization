import React, { Component } from "react";
import CappuToken from "./contracts/CappuToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded:false, kycAddress:"0x123...", tokenSaleAddress: null, userTokens:0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      // console.log(this.networkId);
     
      this.tokenInstance = new this.web3.eth.Contract(
        CappuToken.abi,
        CappuToken.networks[this.networkId] && CappuToken.networks[this.networkId].address,
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer();
      this.setState({ loaded:true , tokenSaleAddress: MyTokenSale.networks[this.networkId].address},this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateUserTokens = async () => {
    let userTokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens:userTokens});
  };

  listenToTokenTransfer = () => {
    this.tokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }

  handleBuyTokens = async () => {
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from:this.accounts[0], value: this.web3.utils.toWei("1", "wei")});
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value ;
    const name = target.name;
    this.setState({
      [name] : value
    });
  };

  handleKycEvent = async() => {
    // console.log(this.kycInstance);
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({ from:this.accounts[0] });
    alert("KYC completed!");
  };


  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Ganu Cappuchino Token Sale</h1>
        <p>Buy your token today!</p>
        <h2>KYC Whitelisting</h2>
        Address to Allow: <input type = "text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/>
        <br/><br/>
        <button type = "button" onClick={this.handleKycEvent}>Whitelist the address</button>
        <br/><br/>
        <h2>Buy Tokens</h2>
        <p>If you want to buy tokens then send Wei to this Address: {this.state.tokenSaleAddress}</p>
        <p>You currently have {this.state.userTokens} CAPPU tokens</p>
        <button type="button" onClick={this.handleBuyTokens}>Get more tokens</button>
      </div>
    );
  }
}

export default App;
