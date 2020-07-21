import Web3 from 'web3'

export const ethEnabled = () => {
    return !!Web3.givenProvider
}


let web3

export const connect = async () => {
    web3 = new Web3(Web3.givenProvider)
}

export const currentProvider = () => Web3.givenProvider

export const getWeb3 = () => web3

export const requestEthAddress = async () => (await web3.eth.requestAccounts())[0]

export const getEthAddress = async () => (await web3.eth.getAccounts())[0]
