import React, { useState, useEffect, createContext } from 'react';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import ticketingPlatformABI from './constants';; // Import the ABI of your contract
import ticketingPlatformAddress from './constants'; 
//const ticketingPlatformAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address

const TicketingPlatformContext = createContext();

const fetchTicketingContract = (signer) =>
  new ethers.Contract(ticketingPlatformAddress, ticketingPlatformABI, signer);

export const TicketingPlatformProvider = ({ children }) => {
  const [account, setAccount] = useState('');
  const [occasions, setOccasions] = useState([]);

 
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting to MetaMask", error);
    }
  };

  const fetchOccasions = async () => {
    if (!account) return;
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const contract = fetchTicketingContract(provider);
      
      // You'll need to adjust this part based on how occasions are stored/retrieved in your contract
      const occasionsData = await contract.getOccasions();
      setOccasions(occasionsData);
    } catch (error) {
      console.error("Error fetching occasions", error);
    }
  };
  const setEventTicketSupply = async (eventId, supply, price) => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchTicketingContract(signer);

        const transaction = await contract.setEventTicketSupply(eventId, supply, price);
        await transaction.wait();
    } catch (error) {
        console.error("Error setting event ticket supply", error);
    }
};

const setEventBatchTicketSupply = async (eventId, batch, supply, price) => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchTicketingContract(signer);

        const transaction = await contract.setEventBatchTicketSupply(eventId, batch, supply, price);
        await transaction.wait();
    } catch (error) {
        console.error("Error setting event batch ticket supply", error);
    }
};

const pauseContract = async () => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchTicketingContract(signer);

        const transaction = await contract.pause();
        await transaction.wait();
    } catch (error) {
        console.error("Error pausing the contract", error);
    }
};

const unpauseContract = async () => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchTicketingContract(signer);

        const transaction = await contract.unpause();
        await transaction.wait();
    } catch (error) {
        console.error("Error unpausing the contract", error);
    }
};

const isContractPaused = async () => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const contract = fetchTicketingContract(provider);

        return await contract.isPaused();
    } catch (error) {
        console.error("Error checking if the contract is paused", error);
        return false;
    }
};

const mintTicket = async (eventId, to) => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchTicketingContract(signer);

        // Value to be sent for minting (in Wei)
        const ticketPrice = await contract.eventTicketPrice(eventId);
        const transaction = await contract.mintTicket(eventId, to, {
            value: ticketPrice
        });
        await transaction.wait();
    } catch (error) {
        console.error("Error minting unique ticket", error);
    }
};

const burnTicket = async (eventId, tokenId) => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchTicketingContract(signer);

        const transaction = await contract.burnTicket(eventId, tokenId);
        await transaction.wait();
    } catch (error) {
        console.error("Error burning unique ticket", error);
    }
};

const mintTicketBach = async (eventId, to, batch, value, isUnique) => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchTicketingContract(signer);

        let transaction;
        if (isUnique) {
            // Mint ERC721 Ticket
            transaction = await contract.mintTicket(eventId, to, {
                value: ethers.utils.parseEther(value.toString()) // Convert ETH value to Wei
            });
        } else {
            // Mint ERC1155 Ticket
            transaction = await contract.mintTicket(eventId, to, batch, value, {
                value: ethers.utils.parseEther(value.toString()) // Convert ETH value to Wei
            });
        }
        await transaction.wait();
    } catch (error) {
        console.error("Error minting ticket", error);
    }
};

const burnTicketBach = async (eventId, tokenId, batch, value, isUnique) => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const contract = fetchTicketingContract(signer);

        let transaction;
        if (isUnique) {
            // Burn ERC721 Ticket
            transaction = await contract.burnTicket(eventId, tokenId);
        } else {
            // Burn ERC1155 Ticket
            transaction = await contract.burnTicket(eventId, batch, value);
        }
        await transaction.wait();
    } catch (error) {
        console.error("Error burning ticket", error);
    }
};
  
  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  return (
    <TicketingPlatformContext.Provider 
      value={{
        account,
        occasions,
        connectWallet,
        fetchOccasions,
        setEventTicketSupply,
        setEventBatchTicketSupply,
        pauseContract,
        unpauseContract,
        isContractPaused,
        mintTicket,
        mintTicketBach,
        burnTicket,
        burnTicketBach
        
      }}>
      {children}
    </TicketingPlatformContext.Provider>
  );
};

export default TicketingPlatformContext;
