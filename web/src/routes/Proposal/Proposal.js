import { useParams } from 'react-router-dom'
import { Header, Heading, Box, TextInput, Text, Button, Form, Table, TableHeader, TableBody, TableCell, TableRow, FormField } from 'grommet'
import React, {useState, useEffect} from 'react'
import { downloadFile } from '../../services/ipfs'
import {getAddress, getProposalSubmissions, submitSolution, getProposalOwner, endProposalOwner} from '../../services/web3'
import { problemSchemaToProposal } from "../../utils"
import IpfsUploader from '../../components/IpfsUploader'
import { useHistory } from 'react-router-dom'

const DataField = ({label, value}) => {
    return <Box align={'start'}>
        <Text>{label}</Text>
        <Box direction={'row'} gap={'small'}>
            <TextInput value={value}/>
            <Button size={"medium"} primary label={'Download'}/>
        </Box>
    </Box>
}

const SolutionRow = ({solution, maxScore, bounty}) => {
    const { cid, score } = solution
    const expectedReward = bounty * (score / maxScore)

    return <TableRow>
        <TableCell scope={'row'}>{cid}</TableCell>
        <TableCell scope={'row'}>{score}</TableCell>
        <TableCell>{expectedReward}</TableCell>
        <TableCell><Button size={"medium"} primary label={'Download'}/></TableCell>
    </TableRow>
}

const SolutionTable = ({solutions, title, description, emptyText, bounty}) => {
    let maxScore = 0;
    solutions.forEach(({score}) => {
        if (maxScore < score) {
            maxScore = score;
        }
    })

    return <Box gap={'small'} pad={'0 20px'}>
        <Heading level={2} margin={'none'}>{title}</Heading>
        <Text>{description}</Text>
        {!!solutions.length && <Table>
            <TableHeader>
                <TableRow>
                    <TableCell scope="col" border="bottom">
                        IPFS CID
                    </TableCell>
                    <TableCell scope="col" border="bottom">
                        Accuracy Score
                    </TableCell>
                    <TableCell scope="col" border="bottom">
                        Expected Reward (Wei)
                    </TableCell>
                    <TableCell scope="col" border="bottom">
                    </TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {solutions.map(solution => <SolutionRow solution={solution} bounty={bounty} maxScore={maxScore}/>)}
            </TableBody>
        </Table>}
        {solutions.length === 0 && <Text weight={'bold'}>{emptyText}</Text>}
    </Box>
}

export default () => {
    const history = useHistory()
    const { address } = useParams()
    const [loading, setLoading] = useState(true)
    const [proposal, setProposal] = useState(null)
    const [solutions, setSolutions] = useState([])
    const [owner, setOwner] = useState(null)

    useEffect(() => {
        (async () => {
            const proposalData = await downloadFile(address)
            console.log(JSON.parse(proposalData))
            setProposal(problemSchemaToProposal(JSON.parse(proposalData)))
            setSolutions(await getProposalSubmissions(address))
            setOwner(await getProposalOwner(address))
            setLoading(false)
        })()
    }, [])

    const onSubmit = async ({model, accuracy}) => {
        await submitSolution({problemCid: address, solutionCid: model, accuracy})
        history.push('/')
    }

    const endProposal = async () => {
        await endProposalOwner(address)
    }

    if (loading) return <h1>Loading...</h1>

    const { name, description, value, trainX, trainY, validateX, validateY } = proposal

    const sortedSolutions = solutions.sort((a, b) => a.score > b.score ? 1 : -1)

    const yourSolutions = sortedSolutions.filter(solution => solution.owner === getAddress())
    const theirSolutions = sortedSolutions.filter(solution => solution.owner !== getAddress())

    const isOwner = owner !== getAddress()

    return <Box gap={'medium'}>
        <Header background={'light-3'} pad={'medium'}>
            <Box>
                <Heading margin={'none'}>Proposal</Heading>
                <Heading level={2}>{name}</Heading>
                <Heading margin='none' level={4}>{description}</Heading>
            </Box>
            <Box align={'end'} pad={'medium'}>
                <Heading color={'neutral-2'} level={3} margin={'none'}>Bounty Value:</Heading>
                <Heading color={'neutral-2'} level={3}>{value} Wei</Heading>
                {isOwner && <Button primary label={'End Proposal'} onClick={endProposal}/>}
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
                {!isOwner && <>
                    <Box gap={'small'} pad={'0 20px 10px 20px'}>
                        <Heading level={2} margin={'none'}>Model Submission</Heading>
                        <Text>Submit your trained model to claim part of this bounty</Text>
                    </Box>
                    <Form onSubmit={({value}) => onSubmit(value)}>
                        <IpfsUploader name={'model'} label={'Model File'} required/>
                        <Box align={'start'} margin={'10px 0'} pad={'0 10px'}>
                            <Text margin={'5px 0'}>Accuracy Score</Text>
                            <TextInput type='number' name={'accuracy'} required/>
                        </Box>
                        <Button margin={'10px 0'} label={'Submit Model'} type={'submit'} primary/>
                    </Form>
                    <Box width={'20px'} height={'20px'}/>
                </>}
                {!isOwner && <>
                    <SolutionTable
                        title={'Your Submitted Solutions'}
                        description={'Your trained models submitted for this training proposal'}
                        emptyText={'You haven\'t submitted a solution yet! Use the form above.'}
                        solutions={yourSolutions}
                    />
                    <Box width={'20px'} height={'30px'}/>
                    <SolutionTable
                        title={'Other Submitted Solutions'}
                        description={'Trained models submitted for this training proposal'}
                        emptyText={'No solutions have been submitted yet!'}
                        solutions={theirSolutions}
                    />
                </>}
                {isOwner && <SolutionTable
                    title={'Submitted Solutions'}
                    description={'Trained models submitted for your training proposal'}
                    emptyText={'No solutions have been submitted yet!'}
                    solutions={sortedSolutions}
                />}
                <Box width={'20px'} height={'40px'}/>
            </Box>
        </Box>
    </Box>
}
