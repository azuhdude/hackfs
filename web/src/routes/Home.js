import ProposalForm from "../components/ProposalForm"
import ProposalView from "../components/ProposalView"
import React, {useState} from "react"
import {uploadFile} from "../services/ipfs"
import {getClient} from "../services/3box"
import { Grid, Box, Heading, Header, Button} from 'grommet'
import { useHistory } from 'react-router-dom'

const testProposal = {
    name: 'Some Proposal',
    description: 'Some Description',
    value: '4',
    address: 'some_address'
}

const realProposals = ['QmbRM4TfQuboPmsqHVPfycH7JavvEnMG4XFCXe5SVvRBQZ']

export default () => {
    const [name, setName] = useState('')
    const [profile, setProfile] = useState({})
    const [proposalAddress, setProposalAddress] = useState(null)
    const [downloadedProposal, setDownloadedProposal] = useState(null)

    const history = useHistory()

    const refreshProfile = async () => {
        const name = await getClient().public.get('name')
        setProfile({...profile, name})
    }

    const submitProposal = async (data) => {
        const address = await uploadFile({content: JSON.stringify(data)})
        setProposalAddress(address)
    }

    const onClickProposal = (address) => {
        history.push(`/proposals/${address}`)
    }

    return <>
        <Header pad={'medium'}>
            <Heading>Machine Learning. Together.</Heading>
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
            <Box gridArea="left" background="light-2" >
                <Heading level={2}>
                    Active Proposals
                </Heading>
                {realProposals.map(realProp => <ProposalView address={realProp} onClick={onClickProposal}/>)}
            </Box>
            <Box gridArea="center" background="light-2" >
                <Heading level={2}>
                    Completed Proposals
                </Heading>
            </Box>
            <Box gridArea="right" background="light-2" >
                <Heading level={2}>
                    Your Submitted Models
                </Heading>
            </Box>
        </Grid>
    </>
}
