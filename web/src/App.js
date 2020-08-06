import React, { useEffect, useState } from 'react';
import { connect, getAddress, getBalance } from './services/web3'
import { connect as connect3Box, getClient } from './services/3box'
import { connect as connectIpfs, uploadFile, downloadFile } from './services/ipfs'
import './App.css';
import Home from './routes'
import {Grommet, Box, Main, Text, Header} from 'grommet'
import styled from 'styled-components'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import { useInterval, useHover } from "react-use"

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

const BalanceBox = styled(Box)`
    border-radius: 10px;
`

function App() {
    const [loading, setLoading] = useState(true)
    const [balance, setBalance] = useState(null)

    useEffect(() => {
        (async () => {
            await connect()
            await connectIpfs()
            setBalance(await getBalance())
            setLoading(false)
        })()
    }, [])

    useInterval(() => {
        (async () => {
            setBalance(await getBalance())
        })()
    }, 5000)

    const hoverAddress = (hovered) => {
        const address = getAddress()
        return <Box align={'end'} style={{cursor: 'pointer'}}>
            <Text size="small" weight={'bold'}>Address</Text>
            <Text size="small">{hovered || !address ? address : `${address.slice(0, 7)}...`}</Text>
        </Box>
    }

    const [hoverableAddress] = useHover(hoverAddress)

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
                            <Header background={'light-3'}>
                                <BalanceBox width={'100%'} direction={'row'} justify={'end'} pad={'10px 20px 0 0'}>
                                    <Box direction={'row'} justify={'end'} gap={'medium'}>
                                        {hoverableAddress}
                                        <Box align={'start'}>
                                            <Text size="small" weight={'bold'}>Balance</Text>
                                            <Text size="small">{Math.round((balance || 0) * 100) / 100} ETH</Text>
                                        </Box>
                                    </Box>
                                </BalanceBox>
                            </Header>
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
