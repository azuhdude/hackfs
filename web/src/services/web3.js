import Web3 from 'web3'
import ProposalContract from '../contracts/ProposalContract'

const network = "5777"

export const ethEnabled = () => {
    return !!Web3.givenProvider
}

let web3, contract, address

export const connect = async () => {
    web3 = new Web3(Web3.givenProvider)
    await requestAccounts()
    contract = new web3.eth.Contract(ProposalContract.abi, ProposalContract.networks[network].address, {
        from: await getEthAddress()
    })
}

export const currentProvider = () => Web3.givenProvider

export const requestAccounts = async () => {
    await web3.eth.requestAccounts()
}

export const getEthAddress = async () => {
    if (address) return address
    address = (await web3.eth.getAccounts())[0]
    return address
}

export const getAddress = () => address

export const getProposals = async () => {
    const proposalSize = await contract.methods.getProposalCount().call()

    const proposals = []
    for (let i = 0; i < proposalSize; i++) {
        const cid = await contract.methods.proposalList(i).call()
        proposals.push({
            ...await contract.methods.proposals(cid).call(),
            cid
        })
    }
    console.log("proposal size", proposalSize)
    console.log("proposals", proposals)
    return proposals
}

export const getProposal = async(address) => {
    return await contract.methods.proposals(address).call()
}

export const getProposalOwner = async (cid) => {
    const proposal = await contract.methods.proposals(cid).call()

    console.log("proposal owner", proposal.sender)
    return proposal.sender
}

export const getProposalSubmissions = async (cid) => {
    const solutionsSize = await contract.methods.getProposalSolutionCount(cid).call()

    const solutions = []
    for (let i = 0; i < solutionsSize; i++) {
        solutions.push(await contract.methods.getProposalSolution(cid, i).call())
    }
    console.log("solutions size", solutionsSize)
    console.log("solutions", solutions)
    return solutions
}

export const proposeCreate = async ({address, value, endDateMS}) => {
    console.log('sending value', value)
    await contract.methods.proposeCreate(address, endDateMS).send({
        from: await getEthAddress(),
        value: web3.utils.toWei(value, 'ether')
    })
}

export const endProposalOwner = async (address) => {
    await contract.methods.proposeEnd(address).send()
}

export const endProposalDate = async (address) => {
    await contract.methods.proposeEndDate(address).send()
}

export const submitSolution = async ({problemCid, solutionCid, accuracy, preprocessor}) => {
    await contract.methods.solutionCreate(problemCid, solutionCid, accuracy, preprocessor).send()
}

export const getSolutionsForAddress = async() => {
    const solutionsSize = await contract.methods.getSolutionsForAddressLength().call()
    const solutionProposalAddresses = []
    console.log('solution size', solutionsSize)

    for (let i = 0; i < solutionsSize; i++) {
        const cid = await contract.methods.solutionsForAddr(address, i).call()
        solutionProposalAddresses.push({
            ...await contract.methods.proposals(cid).call(),
            cid
        })
    }

    return solutionProposalAddresses
}
