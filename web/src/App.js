import React, { useEffect, useState } from 'react';
import { connect } from './services/web3'
import { connect as connect3Box, getClient } from './services/3box'
import { connect as connectIpfs, uploadFile, downloadFile } from './services/ipfs'
import './App.css';
import Home from './routes'
import { Grommet, Main } from 'grommet'

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            await connect()
            // await connect3Box()
            await connectIpfs()
            setLoading(false)
        })()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <Grommet>
            <Main>
                <div className="App">
                    <Router>
                        <Switch>
                            <Route path={'/'}>
                                <Home/>
                            </Route>
                        </Switch>
                    </Router>
                </div>
            </Main>
        </Grommet>
    );
}

export default App;
