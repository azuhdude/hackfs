import { getEthAddress, currentProvider } from "./web3"

let user, space, box

Error.stackTraceLimit=200

export const connect = async () => {
    const Box = window.Box
    const address = await getEthAddress() // await getEthAddress()
    console.log(`eth address`, address)
    box = await Box.create(currentProvider())
    console.log(box)
    const spaces = [ 'hackfs-azuh']
    await box.auth(spaces, { address })
    console.log('open space')
    space = await box.openSpace('hackfs-azuh')

    console.log('box is open')
}

export const getClient = () => box
