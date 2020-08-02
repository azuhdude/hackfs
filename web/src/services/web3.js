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
    contract = new web3.eth.Contract(ProposalContract.abi, ProposalContract.networks["5777"].address, {
        from: await getEthAddress()
    })
}

export const currentProvider = () => Web3.givenProvider

export const getWeb3 = () => web3

export const requestEthAddress = async () => (await web3.eth.requestAccounts())[0]

export const getEthAddress = async () => (await web3.eth.getAccounts())[0]

export const getProposals = async () => {
    const proposalSize = await contract.methods.getProposalCount().call()

    const cids = []
    for (let i = 0; i < proposalSize; i++) {
        cids.push(await contract.methods.proposalList(i).call())
    }
    console.log("proposal size", proposalSize)
    console.log("proposals", cids)
    return cids
}

export const getProposalSubmissions = async (cid) => {
    const solutionsSize = await contract.methods.getProposalSolutionCount(cid).call()

    const cids = []
    for (let i = 0; i < solutionsSize; i++) {
        cids.push(await contract.methods.getProposalSolution(cid, i).call())
    }
    console.log("solutions size", solutionsSize)
    console.log("solutions", cids)
    return cids
}

export const proposeCreate = async ({address, value}) => {
    console.log(value)
    await contract.methods.proposeCreate(address).send({
        from: await getEthAddress(),
        value
    })
}

export const submitSolution = async ({problemCid, solutionCid}) => {
    await contract.methods.solutionCreate(problemCid, solutionCid).send()
}
