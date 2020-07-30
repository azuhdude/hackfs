import ipfs from 'ipfs'

let client

export const getClient = () => client

export const connect = async () => {
    client = await ipfs.create()
    console.log(`IPFS Version`, await client.version())
    console.log(`IPFS Config`, await client.config.getAll())
}

export const uploadFile = async ({path, content}) => {
    const fileAdded = await client.add({
        path,
        content
    })

    console.log('Added file:', fileAdded.path, fileAdded.cid.toString())

    return fileAdded.cid.toString()
}

export const downloadFile = async (address) => {
    const chunks = []
    console.log(`downloading file from ${address}`)
    for await (const chunk of client.cat(address)) {
        chunks.push(chunk)
    }
    console.log('finished downloading')
    return Buffer.concat(chunks).toString()
}

export const validateAddress = async (address) => {
    console.log(`validating file from ${address}`)
    try {
        for await (const file of client.cat(address)) {
            return true
        }
    } catch {
    }

    return false
}

export const downloadFiles = async (addresses) => {
    return await Promise.all(addresses.map(downloadFile))
}
