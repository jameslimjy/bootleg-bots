import './App.css';
import React, { useEffect, useState } from 'react';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';

const contractAddress = "0x3408E187F16425dAAce6Cef99560d61169C9514D";
const abi = contract.abi;

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);
  
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
    } else {
      console.log("No account found")
    }
   }

  const connectWalletHandler = async () => { 
    const { ethereum } = window;

    if (!ethereum) {
      alert("Need to install Metamask!");
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

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.01") });

        console.log("Mining... pls wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
      
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
  }, [])

    return (
        <div className='main-app'>
          <h1>Bootleg Bots</h1>
          <div>
            {currentAccount ? mintNftButton() : connectWalletButton()}
          </div>
        </div>
    )
}

export default App;