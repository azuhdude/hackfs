import React, { useEffect, useState } from 'react';
import { connect } from './services/web3'
import { connect as connect3Box, getClient } from './services/3box'
import { connect as connectIpfs } from './services/ipfs'
import logo from './logo.svg';
import './App.css';

function App() {

  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')

  useEffect(() => {
      (async () => {
        await connect()
        await connect3Box()
        await connectIpfs()
        setName(await getClient().public.get('name'))
        setLoading(false)
      })()
  }, [])

  const saveName = async () => {
    getClient().public.set('name', name)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const box = getClient()

  return (
    <div className="App">
      <h1>Your 3Box Name is {name || 'not set'}</h1>
      <input placeholder={'Enter Your Name'} onChange={(e) => setName(e.target.value)} value={name}/>
      <button onClick={saveName}>Change Name</button>
    </div>
  );
}

export default App;
