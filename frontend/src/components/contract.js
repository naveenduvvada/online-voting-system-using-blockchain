import web3 from './web3';
import VotingContractABI from "./VotingContractABI.json";

const instance = new web3.eth.Contract(
    VotingContractABI.abi,
    VotingContractABI.networks[5777].address
);
export default instance;
