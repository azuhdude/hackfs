import ProposalView from "../components/ProposalView"
import React, {useState, useEffect} from "react"
import { Grid, Box, Heading, Header, Button} from 'grommet'
import { useHistory } from 'react-router-dom'
import { getProposals, getSolutionsForAddress } from '../services/web3'

export default () => {
    const [proposals, setProposals] = useState([])
    const [solutions, setSolutions] = useState([])

    useEffect(() => {
        (async () => {
            setProposals(await getProposals())
            setSolutions(await getSolutionsForAddress())
        })()
    }, [])


    const history = useHistory()

    const onClickProposal = (address) => {
        history.push(`/proposals/${address}`)
    }

    const activeProposals = proposals.filter(proposal => proposal.status === "1")
    const inactiveProposals = proposals.filter(proposal => proposal.status === "0")

    console.log('solutions', solutions)

    return <>
        <Header pad={'medium'}>
            <Heading>Incentivized Machine Learning.</Heading>
            <Button primary label={'Submit a Proposal'} onClick={() => history.push('/newProposal')}/>
        </Header>
        <Grid
            rows={['full']}
            columns={['1/3', '1/3', '1/3']}
            gap="medium"
            areas={[
                { name: 'left', start: [0, 0], end: [0, 0] },
                { name: 'center', start: [1, 0], end: [1, 0] },
                { name: 'right', start: [2, 0], end: [2, 0] },
            ]}
        >
            <Box gridArea="left" align={'center'} background="light-2" >
                <Heading level={2}>
                    Active Proposals
                </Heading>
                {activeProposals.map(prop => <ProposalView address={prop.cid} onClick={onClickProposal}/>)}
            </Box>
            <Box gridArea="center" align={'center'} background="light-2" >
                <Heading level={2}>
                    Completed Proposals
                </Heading>
                {inactiveProposals.map(prop => <ProposalView address={prop.cid} onClick={onClickProposal}/>)}
            </Box>
            <Box gridArea="right" align={'center'} background="light-2" >
                <Heading level={2}>
                    Your Submitted Models
                </Heading>
                {solutions.map(prop => <ProposalView address={prop.cid} onClick={onClickProposal} solutionView/>)}
            </Box>
        </Grid>
    </>
}
