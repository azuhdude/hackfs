import React, { useEffect, useState } from 'react';
import { connect } from './services/web3'
import { connect as connect3Box } from './services/3box'
import logo from './logo.svg';
import './App.css';

function App() {

  const [loading, setLoading] = useState(true)

  useEffect(() => {
      (async () => {
        await connect()
        await connect3Box()
        setLoading(false)
      })()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
