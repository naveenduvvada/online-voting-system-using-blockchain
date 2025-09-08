import Web3 from 'web3';
import CollegeElection from "./CollegeElection.json"

const web3 = new Web3(window.ethereum);
const contractAddress = '0x73443297636015457e0e6f9fe9a982f47ff3259d7490f6ef399115aef7b85741';
const contract = new web3.eth.Contract(CollegeElection, contractAddress);


export { web3, contract };