import ipfs from 'ipfs'

let client

export const getClient = () => client

export const connect = async () => {
    client = await ipfs.create()
    console.log(`IPFS Version`, await client.version())
    console.log(`IPFS Config`, await client.config.getAll())
    const fileAdded = await client.add({
        path: 'test.txt',
        content: 'Hello World 10111!!'
    })

    console.log('Added file:', fileAdded.path, fileAdded.cid.toString())
}

export const uploadFile = async () => {
    const fileAdded = await client.add({
        path: 'test.txt',
        content: 'Hello World 10111!!'
    })

    console.log('Added file:', fileAdded.path, fileAdded.cid.toString())

    return fileAdded.cid.toString()
}
