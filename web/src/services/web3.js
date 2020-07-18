import Web3 from 'web3'

export const ethEnabled = () => {
    return !!Web3.givenProvider
}

export const connect = () => {
    const web3 = new Web3(Web3.givenProvider)

}

const web3 = new Web3(Web3.givenProvider)
