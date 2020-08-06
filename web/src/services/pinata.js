const API_KEY = "34226ed9ae4a140058a8"
const API_SECRET = "cc95c71d7b49c31eb375a846449193701d8e3ffdf0f342c4d06492ed4acdb090"

const BASE_URL = 'https://api.pinata.cloud'


export const uploadJSON = async (data) => {
    const res = await fetch(`${BASE_URL}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
            pinata_api_key: API_KEY,
            pinata_secret_api_key: API_SECRET,
            'Content-Type': 'application/json'
        },
        body: data
    })

    const { IpfsHash } = await res.json()

    return IpfsHash
}
