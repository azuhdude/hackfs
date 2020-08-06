import React, { useEffect, useState } from 'react';
import { getAddress, getBalance } from './services/web3'
import './App.css';
import Home from './routes'
import {Grommet, Box, Main, Text, Header} from 'grommet'
import { Tree, Sync, Database  } from 'grommet-icons'
import styled from 'styled-components'
import {
    useHistory
} from "react-router-dom";
import { useInterval, useHover } from "react-use"

const BalanceBox = styled(Box)`
    border-radius: 10px;
`

const FixedHeader = styled(Header)`
    position: fixed;
    width: 100%;
`

function Layout() {
    const [balance, setBalance] = useState(null)
    const history = useHistory()

    useEffect(() => {
        (async () => {
            setBalance(await getBalance())
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

    const goHome = () => {
        history.push('/')
    }

    const [hoverableAddress] = useHover(hoverAddress)

    return (<>
            <FixedHeader>
                <BalanceBox width={'100%'} direction={'row'} justify={'end'} pad={'10px 20px 0 20px'}>
                    {/*<Box direction={'row'} gap={'small'} pad={'20px'} onClick={goHome}>*/}
                    {/*    <Database size={'40px'}/>*/}
                    {/*    <Sync size={'40px'}/>*/}
                    {/*    <Tree size={'40px'}/>*/}
                    {/*</Box>*/}
                    <Box direction={'row'} justify={'end'} gap={'medium'}>
                        {hoverableAddress}
                        <Box align={'start'}>
                            <Text size="small" weight={'bold'}>Balance</Text>
                            <Text size="small">{Math.round((balance || 0) * 100) / 100} ETH</Text>
                        </Box>
                    </Box>
                </BalanceBox>
            </FixedHeader>
            <Home/>
            <Box height={'40px'} width={'1px'}/>
        </>
    );
}

export default Layout;
