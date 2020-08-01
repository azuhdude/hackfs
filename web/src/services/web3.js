import Web3 from 'web3'
import ProposalContract from '../contracts/ProposalContract'

// TODO fill in contract address
const contractAddress = ''


export const ethEnabled = () => {
    return !!Web3.givenProvider
}


let web3, contract

export const connect = async () => {
    web3 = new Web3(Web3.givenProvider)
    contract = new web3.eth.Contract(ProposalContract.abi, ProposalContract.networks["5777"].address)
}

export const currentProvider = () => Web3.givenProvider

export const getWeb3 = () => web3

export const requestEthAddress = async () => (await web3.eth.requestAccounts())[0]

export const getEthAddress = async () => (await web3.eth.getAccounts())[0]

export const getProposals = async () => {
    const proposalSize = await contract.methods.getProposalCount().call()
    console.log("proposal size", proposalSize)
}

