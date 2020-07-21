import { getEthAddress, currentProvider } from "./web3"

let user, space

Error.stackTraceLimit=200

export const connect = async () => {
    const Box = window.Box
    const address = await getEthAddress() // await getEthAddress()
    console.log(`eth address`, address)
    const box = await Box.create(currentProvider())
    console.log(box)
    const spaces = [ 'hackfs-azuh']
    await box.auth(spaces, { address })
    console.log('open space')
    space = await box.openSpace('hackfs-azuh')

    console.log('box is open')
}

//bafyreidf6mighwj445rmb3qdqnrkwokq2hvu6rfxk6em7j6uu2i2p4sfxm
//bafyreiez6c4bfkflxgwetrlpzng3ki5cqk7ge6qtudyzs3cytv6vd5fbne
