import { useParams } from 'react-router-dom'
import { Header, Heading, Box, TextInput, Text, Button, Form, Table, TableHeader, TableBody, TableCell, TableRow, FormField } from 'grommet'
import React, {useState, useEffect} from 'react'
import { downloadFile } from '../../services/ipfs'
import {getAddress, getProposalSubmissions, submitSolution, getProposalOwner, endProposalOwner} from '../../services/web3'
import { problemSchemaToProposal } from "../../utils"
import IpfsUploader from '../../components/IpfsUploader'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

const OverflowTableCell = styled(TableCell)`
    overflow-x: auto;
    max-width: 200px;
`

const DataField = ({label, value}) => {
    return <Box align={'start'}>
        <Text>{label}</Text>
        <Box direction={'row'} gap={'small'}>
            <TextInput value={value}/>
            <Button size={"medium"} primary label={'Download'}/>
        </Box>
    </Box>
}

const SolutionRow = ({solution}) => {
    const { cid, score, expectedReward } = solution

    return <TableRow>
        <OverflowTableCell scope={'row'}>{cid}</OverflowTableCell>
        <TableCell scope={'row'}>{score}</TableCell>
        <TableCell>{expectedReward}</TableCell>
        <TableCell><Button size={"medium"} primary label={'Download'}/></TableCell>
    </TableRow>
}

const SolutionTable = ({solutions, title, description, emptyText}) => {
    return <Box gap={'small'} pad={'0 20px'} width={'600px'}>
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
                        Expected Reward (ETH)
                    </TableCell>
                    <TableCell scope="col" border="bottom">
                    </TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {solutions.map(solution => <SolutionRow solution={solution}/>)}
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

    let maxScore = 0
    let totalPerformance = 0
    sortedSolutions.forEach(solution => {
        if (maxScore < solution.score || 0) {
            maxScore = solution.score
        }
    })


    sortedSolutions.forEach(solution => {
        solution.performance = solution.score / maxScore
        totalPerformance += solution.performance
    })

    console.log(maxScore, totalPerformance)

    sortedSolutions.forEach(solution => {
        solution.expectedReward = ((solution.score / maxScore) / totalPerformance) * value
    })

    const yourSolutions = sortedSolutions.filter(solution => solution.owner === getAddress())
    const theirSolutions = sortedSolutions.filter(solution => solution.owner !== getAddress())

    const isOwner = owner !== getAddress()

    return <Box gap={'medium'}>
        <Header background={'light-3'} pad={'medium'}>
            <Box align={'start'}>
                <Heading margin={'none'}>Proposal</Heading>
                <Heading level={2}>{name}</Heading>
                <Heading margin='none' level={4} textAlign={'left'}>{description}</Heading>
            </Box>
            <Box align={'end'} pad={'medium'}>
                <Heading color={'neutral-2'} level={3} margin={'none'}>Bounty Value:</Heading>
                <Heading color={'neutral-2'} level={3}>{value} ETH</Heading>
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
                    <Box gap={'small'} width="600px" pad={'0 20px 10px 20px'}>
                        <Heading level={2} margin={'none'}>Model Submission</Heading>
                        <Text>Submit your trained model to claim part of this bounty</Text>
                    </Box>
                    <Box width={"600px"} pad={"0 10px"}>
                        <Form onSubmit={({value}) => onSubmit(value)}>
                            <Box align={'start'}>
                                <IpfsUploader name={'model'} label={'Model File'} required/>
                                <Box align={'start'} margin={'10px 0'} pad={'0 10px'}>
                                    <Text margin={'5px 0'}>Accuracy Score</Text>
                                    <TextInput type='number' name={'accuracy'} required/>
                                </Box>
                                <Button margin={'10px 0'} label={'Submit Model'} type={'submit'} primary/>
                            </Box>
                        </Form>
                    </Box>
                    <Box width={'20px'} height={'20px'}/>
                </>}
                {!isOwner && <>
                    <SolutionTable
                        title={'Your Submitted Solution'}
                        description={'Your trained model submitted for this training proposal'}
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
