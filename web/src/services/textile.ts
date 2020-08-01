import {Libp2pCryptoIdentity} from '@textile/threads-core';
import { getSpace } from './3box'

import {Client, Identity, KeyInfo, ThreadID} from '@textile/hub';
import { Database } from '@textile/threads-database'

const userGroupKey = 'bcajyebrdhea4udzumuhfujqs2u'

const keyInfo: KeyInfo = {
    key: userGroupKey,
}

const threadID : ThreadID = ThreadID.fromRandom()

let db : Database

export const getIdentity = async () => {
    const  space = getSpace()
    try {
        // We'll try to restore the private key if it's available
        const storedIdent = await space.private.get('identity');
        if (storedIdent === null) {
            throw new Error('No identity')
        }

        return await Libp2pCryptoIdentity.fromString(storedIdent)
    } catch (e) {
        /**
         * If the stored identity wasn't found, create a new one.
         */
        const identity = await Libp2pCryptoIdentity.fromRandom()
        const identityString = identity.toString()
        await space.private.set('identity', identityString);
        return identity
    }
}

export async function authorize (identity: Identity) {
    const client = await Client.withKeyInfo(keyInfo)
    await client.getToken(identity)
    return client
}

const init = async (identity: Identity) => {
    db = await Database.withKeyInfo(keyInfo, 'azuh.requests')
    await db.start(identity, { threadID })
    return db
}

const request = {
    _id: '',
    requestedBy: '',
    value: 0,
    name: '',
}

// const createCollections = async () => {
//     const {collections} = db
//     const existing = collections.get('Requests')
//     if (existing) {
//         return existing
//     } else {
//         return await db.newCollectionFromObject('Requests', request)
//     }
// }
//
// const newRequest = async (data: any) => {
//     const Request = db.collections.get('Request')
//     const req = new Request(data)
//     await req.save()
// }
//
// const getRequests = async () => {
//     const Request = db.collections.get('Request')
//     return await Request.find({})
// }
