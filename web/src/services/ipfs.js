import ipfs from 'ipfs'

let client

export const getClient = () => client

export const connect = async () => {
    client = await ipfs.create()
    console.log(`IPFS Version`, await client.version())
    console.log(`IPFS Config`, await client.config.getAll())
    window.ipfsClient = client
}

export const uploadFile = async ({path, content}) => {
    const fileAdded = await client.add({
        path,
        content
    })

    console.log('Added file:', fileAdded.path, fileAdded.cid.toString())

    return fileAdded.cid.toString()
}

// Function to download data to a file
function saveLocally(data, filename) {
    const file = new Blob([data], {type: 'text/plain'});
    const a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

export const downloadFile = async (address, saveFile) => {
    const chunks = []
    console.log(`downloading file from ${address}`)
    // for await (const chunk of client.cat(address)) {
    //     chunks.push(chunk)
    // }
    const file = await fetch(`https://cloudflare-ipfs.com/ipfs/${address}`)
    console.log('finished downloading')
    // return Buffer.concat(chunks).toString()
    if (saveFile) {
        saveLocally(file, address)
    }
    return await file.text()
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
