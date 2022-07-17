import './App.css';
import React, { useEffect, useState } from 'react';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';

const contractAddress = "0x3408E187F16425dAAce6Cef99560d61169C9514D";
const abi = contract.abi;

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [chain, setChain] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Metamask not installed!");
      return;
    } else {
      console.log("Wallet exists! Good to go");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if(accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an account, address: ", account);
      setCurrentAccount(account);
      setCurrentStatus("Wallet connected, ready to proceed :)");
    } else {
      console.log("No account found")
    }
   }

  const checkNetwork = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Need to install Metamask!");
    } else {
      try {
        const provider =  new ethers.providers.Web3Provider(ethereum);
        const chainId = await provider.getNetwork();
        console.log(`chain connected: ${chainId.name}`);
        setChain(chainId.name);
      } catch (err) {
        console.log(err)
      }
    }
  }

  const connectWalletHandler = async () => { 
    const { ethereum } = window;

    if (!ethereum) {
      alert("Need to install Metamask!");
      return;
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account, address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (chain !== "rinkeby") {
        alert("Need to change to rinkeby network before proceeding");

      }

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        setCurrentStatus("Initalizing payment...");
        let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.01") });

        setCurrentStatus("Mining in progress...");
        await nftTxn.wait();

        setCurrentStatus(`Mined! see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      
      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
   }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }


  useEffect(() => {
    checkWalletIsConnected();
    checkNetwork();
  }, [])

    return (
        <div className='main-app'>
          <img src={'../banner-pict.jpg'} alt="banner-pict"></img>
          <h1>Bootleg Bots</h1>
          <div>
            {currentAccount ? mintNftButton() : connectWalletButton()}
          </div>
          <div>
            <h2>Current chain: {chain}</h2>
            <h3>Current status: {currentStatus}</h3>
          </div>
        </div>
    )
}

export default App;