import { useParams } from 'react-router-dom'
import { Header, Heading, Box, TextInput, Text, Button, Form } from 'grommet'
import React, {useState, useEffect} from 'react'
import { downloadFile } from '../../services/ipfs'
import { problemSchemaToProposal } from "../../utils"
import IpfsUploader from '../../components/IpfsUploader'
import { useHistory } from 'react-router-dom'

const DataField = ({label, value}) => {
    return <Box>
        <Text size={'large'} weight={'bold'}>{label}</Text>
        <Box direction={'row'} gap={'small'}>
            <TextInput value={value || 'asdasdas'}/>
            <Button size={"medium"} primary label={'Download'}/>
        </Box>
    </Box>
}

export default () => {
    const history = useHistory()
    const { address } = useParams()
    const [loading, setLoading] = useState(true)
    const [proposal, setProposal] = useState(null)

    useEffect(() => {
        (async () => {
            const proposalData = await downloadFile(address)
            console.log(JSON.parse(proposalData))
            setProposal(problemSchemaToProposal(JSON.parse(proposalData)))
            setLoading(false)
        })()
    }, [])

    const onSubmit = ({model}) => {
        // TODO submit model in smart contract
        history.push('/')
    }

    if (loading) return <h1>Loading...</h1>

    const { name, value, trainX, trainY, validateX, validateY } = proposal

    return <Box gap={'medium'}>
        <Header background={'light-3'} pad={'medium'}>
            <Box>
                <Heading margin={'none'}>Proposal</Heading>
                <Heading level={2}>{name}</Heading>
            </Box>
            <Box align={'end'} pad={'medium'}>
                <Heading color={'neutral-2'} level={3} margin={'none'}>Bounty Value:</Heading>
                <Heading color={'neutral-2'} level={3}>{value} Wei</Heading>
            </Box>
        </Header>
        <Box direction={'row'}>
            <Box width={'50%'} align={'center'} gap={'medium'}>
                <Box gap={'small'} pad={'0 20px'}>
                    <Heading level={2} margin={'none'}>Problem Set Data</Heading>
                    <Text>The data specified for this problem set. Download directly or use the IPFS address.</Text>
                </Box>
                <DataField label={'Training Feature Data'} value={trainX}/>
                <DataField label={'Training Target Data'} value={trainY}/>
                <DataField label={'Validate Feature Data'} value={validateX}/>
                <DataField label={'Validate Target Data'} value={validateY}/>
            </Box>
            <Box width={'50%'} align={'center'} gap={'medium'}>
                <Box gap={'small'} pad={'0 20px'}>
                    <Heading level={2} margin={'none'}>Model Submission</Heading>
                    <Text>Submit your trained model to claim part of this bounty</Text>
                </Box>
                <Form onSubmit={({value}) => onSubmit(value)}>
                    <IpfsUploader name={'model'} label={'Model File'} required/>
                    <Button label={'Submit Model'} type={'submit'} primary/>
                </Form>
            </Box>
        </Box>
    </Box>
}
