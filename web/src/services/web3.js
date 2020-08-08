import Web3 from 'web3'
import ProposalContract from '../contracts/ProposalContract'

const ropstenAddress = '0x36edf8242eea9f67758f56127efa23391a9c4b05'

export const ethEnabled = () => {
    return !!Web3.givenProvider
}

let web3, contract, address

export const getContractAddress = async () => {
    const currentNetwork = await web3.eth.net.getNetworkType()
    const networkId = await web3.eth.net.getId()

    let networkKey
    if (currentNetwork === "private") {
        networkKey = networkId
    } else if (currentNetwork === 'ropsten') {
        return ropstenAddress
    }
    return ProposalContract.networks[networkKey].address
}

export const connect = async () => {
    web3 = new Web3(Web3.givenProvider)

    window.ethereum.on('chainChanged', () => {
        document.location.reload()
    })

    await requestAccounts()
    contract = new web3.eth.Contract(ProposalContract.abi, await getContractAddress(), {
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

export const getBalance = async () => {
    return web3.utils.fromWei(await web3.eth.getBalance(getAddress()), 'ether')
}

export const getProposals = async () => {
    const proposalSize = await contract.methods.getProposalCount().call()

    const proposals = []
    for (let i = 0; i < proposalSize; i++) {
        const cid = await contract.methods.proposalList(i).call()
        proposals.push(await getProposal(cid))
    }
    console.log("proposal size", proposalSize)
    console.log("proposals", proposals)
    return proposals
}

export const getProposal = async(address) => {
    const proposal =  await contract.methods.proposals(address).call()
    const solutionCount = await contract.methods.getProposalSolutionCount(address).call()
    return {
        ...proposal,
        cid: address,
        solutionCount
    }
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

export const getProposalSubmission = async (cid, sender) => {
    debugger
    return await contract.methods.proposals(cid).solutions(sender).call()
}

export const disputeSolution = async (cid, owner) => {
    const gasCost = "0.0001"
    return await contract.methods.disputeSolution(cid, owner).send({
        from: await getEthAddress(),
        value: web3.utils.toWei(gasCost, 'ether')
    });
}

export const proposeCreate = async ({address, value, endDateMS}) => {
    console.log('sending value', value)
    await contract.methods.proposeCreate(address, endDateMS).send({
        from: await getEthAddress(),
        value: web3.utils.toWei(value, 'ether')
    })
}

export const endProposalDate = async (address) => {
    await contract.methods.proposeDateEnd(address).send()
}

export const proposePayout = async (address) => {
    await contract.methods.proposePayout(address).send()
}

export const submitSolution = async ({problemCid, solutionCid, accuracy, preprocessor}) => {
    await contract.methods.solutionCreate(problemCid, solutionCid, accuracy, preprocessor).send()
}

export const getSolutionsForAddress = async() => {
    const solutionsSize = await contract.methods.getSolutionsForAddressLength().call()
    const solutionProposals = []
    console.log('solution size', solutionsSize)

    for (let i = 0; i < solutionsSize; i++) {
        const cid = await contract.methods.solutionsForAddr(address, i).call()
        solutionProposals.push(await getProposal(cid))
    }

    return solutionProposals
}

export const getDisputeStatus = async(cid, owner) => {
    const result = await contract.methods.getDisputeStatus(cid, owner).call()
    if (result === -1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return await getDisputeStatus(cid, owner)
    }

    return result
}
