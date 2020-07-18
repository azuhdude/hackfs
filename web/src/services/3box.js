import { getEthAddress, currentProvider } from "./web3"
import Box from '3box'

let box, space

export const connect = async () => {
    console.log(`eth address`, await getEthAddress())
    box = await Box.openBox(await getEthAddress(), currentProvider())
    console.log('box is open')
    await box.syncDone
    console.log('creating space for user')
    space = await box.openSpace('hackfs-azuh')
    await space.syncDone
    console.log('Done 3Box')
}
