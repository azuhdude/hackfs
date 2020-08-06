import ProposalView from "../components/ProposalView"
import React, {useState, useEffect} from "react"
import { Grid, Box, Heading, Header, Button, Text} from 'grommet'
import { CircleQuestion, Cluster, Multiple, Info } from 'grommet-icons'
import { useHistory } from 'react-router-dom'
import {getAddress, getProposals, getSolutionsForAddress} from '../services/web3'
import styled from 'styled-components'
import { useSearchParam } from 'react-use'
import BackArrow from "../components/BackArrow"

const HoverHeading = styled(Heading)`
    &:hover {
        color: #000;
    }
`

const ProposalsList = ({activeProposals, inactiveProposals, onClickProposal}) => {
   return <Grid
        rows={['full']}
        columns={['auto']}
        gap="medium"
        pad={"medium"}
        areas={[
            { name: 'left', start: [0, 0], end: [0, 0] },
            { name: 'right', start: [1, 0], end: [1, 0] }
        ]}
    >
        <Box gridArea="left" align={'center'} background="light-2" >
            <Heading level={2}>
                Active Proposals
            </Heading>
            {!activeProposals.length && <Heading level={'4'}>No currently active proposals</Heading>}
            {activeProposals.map(prop => <ProposalView proposal={prop} onClick={onClickProposal}/>)}
        </Box>
        <Box gridArea="right" align={'center'} background="light-2" >
            <Heading level={2}>
                Past Proposals
            </Heading>
            {!inactiveProposals.length && <Heading level={'4'}>No past proposals</Heading>}
            {inactiveProposals.map(prop => <ProposalView proposal={prop} onClick={onClickProposal}/>)}
        </Box>
    </Grid>
}

const YourProposalsList = ({yourProposals, onClickProposal}) => {
    return <Box
        width={'100%'}
        align={'center'}
        pad={'medium'}
    >
        <Box width={'600px'} align={'center'} background="light-2" pad={'medium'} style={{borderRadius: '10px'}}>
            <Heading level={2}>
                Your Submitted Proposals
            </Heading>
            {!yourProposals.length && <Text weight={'bold'}>You haven't submitted any proposals!</Text>}
            {yourProposals.map(prop => <ProposalView proposal={prop} onClick={onClickProposal} solutionView/>)}
        </Box>
    </Box>
}

const ModelsList = ({submissions, onClickProposal}) => {
    return <Box
        width={'100%'}
        align={'center'}
        pad={'medium'}
    >
        <Box width={'600px'} align={'center'} background="light-2" pad={'medium'} style={{borderRadius: '10px'}}>
            <Heading level={2}>
                Proposals With Your <br/> Submitted Models
            </Heading>
            {!submissions.length && <Text weight={'bold'}>You haven't submitted any models!</Text>}
            {submissions.map(prop => <ProposalView proposal={prop} onClick={onClickProposal} solutionView/>)}
        </Box>
    </Box>
}

const SquareButton = styled(Box)`
    align-items: center;
    justify-content: space-around;
    width: 300px;
    height: 300px;
    border-radius: 20px;
    cursor: pointer;
    
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    
    &:hover {
        box-shadow: 0 7px 21px rgba(0,0,0,0.25), 0 5px 5px rgba(0,0,0,0.22);
        cursor: pointer;
    }
`

const SubText = styled(Heading)`
    max-width: 700px;
    font-style: italic;
    margin: 10px 0 0 0;
    font-weight: normal;
`

const ButtonControl = ({label, Icon, color, onClick}) => {
    return <SquareButton background={'light-3'} onClick={onClick}>
        <Icon size={'xlarge'}/>
        <Text size={'large'} weight={'bold'}>{label}</Text>
    </SquareButton>
}

export default () => {
    const currentView = useSearchParam('view')
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

    const changeView = (view) => {
        if (!view) {
            if (currentView) {
                history.push('/')
            }
            return
        }
        history.push(`/?view=${view}`)
    }

    const activeProposals = proposals.filter(proposal => proposal.status === "1" && proposal.sender !== getAddress())
    const yourProposals = proposals.filter(proposal => proposal.sender === getAddress())
    const inactiveProposals = proposals.filter(proposal => proposal.status === "0" && proposal.sender !== getAddress())

    let content

    if (!currentView) {
        content = <Box width={'100%'} align={'center'} pad={'100px 0'}>
            <Box direction={'row'} pad={'0 50px'} gap={'medium'}>
                <ButtonControl Icon={Multiple}
                               color={'status-ok'}
                               label={'View Your Proposals'}
                               onClick={() => changeView('yourProposals')}/>
                <ButtonControl Icon={CircleQuestion}
                               color={'status-warning'}
                               label={'View Other Proposals'}
                               onClick={() => changeView('proposals')}/>
                <ButtonControl Icon={Cluster}
                               color={'neutral-3'}
                               label={'View Submitted Models'}
                               onClick={() => changeView('submissions')}/>
            </Box>
        </Box>
    } else if (currentView === 'proposals') {
        content = <ProposalsList activeProposals={activeProposals} inactiveProposals={inactiveProposals} onClickProposal={onClickProposal}/>
    } else if (currentView === 'yourProposals') {
        content = <YourProposalsList yourProposals={yourProposals} onClickProposal={onClickProposal}/>
    } else if (currentView === 'submissions') {
        content = <ModelsList submissions={solutions} onClickProposal={onClickProposal}/>
    }

    return <>
        <Header pad={'medium'} background={'light-3'}>
            <Box>
                <HoverHeading onClick={() => changeView()} style={{cursor: "pointer"}}>
                    <Box direction={'row'} align={'center'}>Incentivized Machine Learning</Box>
                </HoverHeading>
                <SubText level={'4'}>Submit training data and a reward to receive trained prediction models.</SubText>
                <SubText level={'4'}>Train a prediction model to receive a reward.</SubText>
            </Box>
            <Button primary label={'Submit a Proposal'} onClick={() => history.push('/newProposal')}/>
        </Header>
        {currentView && <BackArrow onClick={() => changeView()}/>}
        {content}
    </>
}
