import React, { useEffect, useState } from 'react';
import { connect } from './services/web3'
import { connect as connect3Box, getClient } from './services/3box'
import { connect as connectIpfs, uploadFile, downloadFile } from './services/ipfs'
import './App.css';
import ProposalForm from "./ProposalForm"
import ProposalView from "./ProposalView"

function App() {

    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [profile, setProfile] = useState({})
    const [proposalAddress, setProposalAddress] = useState(null)
    const [downloadedProposal, setDownloadedProposal] = useState(null)

    const refreshProfile = async () => {
        const name = await getClient().public.get('name')
        setProfile({...profile, name})
    }

    useEffect(() => {
        (async () => {
            await connect()
            await connect3Box()
            await connectIpfs()
            await refreshProfile()
            setLoading(false)
        })()
    }, [])

    useEffect(() => {
        if (!proposalAddress) return
        (async () => {
            const data = await downloadFile(proposalAddress)
            setDownloadedProposal(JSON.parse(data))
        })()
    }, [proposalAddress])

    const saveName = async () => {
        await getClient().public.set('name', name)
        await refreshProfile()
    }

    if (loading) {
        return <div>Loading...</div>
    }

    const submitProposal = async (data) => {
        const address = await uploadFile({content: JSON.stringify(data)})
        setProposalAddress(address)
    }

    return (
        <div className="App">
            <h1>Your 3Box Name is {profile.name || 'not set'}</h1>
            <input placeholder={'Enter Your Name'} onChange={(e) => setName(e.target.value)} value={name}/>
            <button onClick={saveName}>Change Name</button>
            <ProposalForm onSubmit={submitProposal}/>
            <h1>The submitted proposal address is {proposalAddress || 'not set'}</h1>
            {downloadedProposal && <ProposalView proposal={downloadedProposal}/>}
        </div>
    );
}

export default App;
