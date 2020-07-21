import React, { useEffect, useState } from 'react';
import { connect } from './services/web3'
import { connect as connect3Box, getClient } from './services/3box'
import { connect as connectIpfs } from './services/ipfs'
import './App.css';

function App() {

    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [profile, setProfile] = useState({})

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

    const saveName = async () => {
        await getClient().public.set('name', name)
        await refreshProfile()
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="App">
            <h1>Your 3Box Name is {profile.name || 'not set'}</h1>
            <input placeholder={'Enter Your Name'} onChange={(e) => setName(e.target.value)} value={name}/>
            <button onClick={saveName}>Change Name</button>
        </div>
    );
}

export default App;
