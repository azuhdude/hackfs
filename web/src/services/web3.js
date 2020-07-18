import Web3 from 'web3'

export const ethEnabled = () => {
    return !!Web3.givenProvider
}


let web3
export const connect = () => {
    web3 = new Web3(Web3.givenProvider)
}

export const currentProvider = () => Web3.givenProvider

export const getWeb3 = () => web3

export const getEthAddress = async () => (await web3.eth.requestAccounts())[0]
