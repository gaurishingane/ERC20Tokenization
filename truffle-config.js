const path = require("path");
require("dotenv").config({path:"./.env"});
const HDWalletProvider = require("@truffle/hdwallet-provider");
const AccountIndex = 0;

module.exports = {
// See <http://truffleframework.com/docs/advanced/configuration>
// to customize your Truffle configuration!
contracts_build_directory: path.join(__dirname, "client/src/contracts"),
networks: {
    development: {
    port: 7545,
    network_id: "*",
    host: "127.0.0.1"
    },
    ganache_network: {
        provider: function() {
            return new HDWalletProvider(process.env.MNEUMONIC, "http://127.0.0.1:7545", AccountIndex);
        },
        network_id:5777
    },
    rinkeby_Infura: {
        provider: function() {
            return new HDWalletProvider(process.env.MNEUMONIC, "https://rinkeby.infura.io/v3/eb79c9f54d6148d1878cfea7da14eb4b", AccountIndex);
        },
        network_id:4
    }
},

compilers: {
    solc: {
    version: "^0.8.0",
    }
}
};