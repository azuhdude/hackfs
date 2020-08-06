import React, { useEffect, useState } from 'react';
import { connect } from './services/web3'
import { connect as connect3Box, getClient } from './services/3box'
import { connect as connectIpfs, uploadFile, downloadFile } from './services/ipfs'
import './App.css';
import Home from './routes'
import {Grommet, Box, Main, Text} from 'grommet'
import styled from 'styled-components'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

const FloatingBalance = styled(Box)`
    position: fixed;
    width: 300px;
    height: auto;
    bottom: 10px;
    right: 50px;
`

const Background = styled(Box)`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
`

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            await connect()
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
                <Background background={'light-1'}/>
                <Router>
                    <Switch>
                        <Route path={'/'}>
                            {/*<FloatingBalance background={'light-2'} pad={'10px'}>*/}
                            {/*    <Text>Address: 0xasdasdasdeqwefsefesfess</Text>*/}
                            {/*    <Text>Balance: 32 ETH</Text>*/}
                            {/*</FloatingBalance>*/}
                            <Home/>
                            <Box height={'40px'} width={'1px'}/>
                        </Route>
                    </Switch>
                </Router>
            </Main>
        </Grommet>
    );
}

export default App;
