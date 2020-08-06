import React, {useEffect, useState} from 'react'
import {Text, Box} from 'grommet'
import {downloadFile} from "../services/ipfs"
import Card from './Card'
import { problemSchemaToProposal} from "../utils"

export default ({proposal, solutionView, onClick}) => {
    const [loading, setLoading] = useState(true)
    const [proposalData, setProposalData] = useState(null)

    const populate = async () => {
        setLoading(true)
        const data = await downloadFile(proposal.cid)
        setProposalData(problemSchemaToProposal(JSON.parse(data)))
        setLoading(false)
    }

    useEffect(() => {
        populate()
    }, [])

    const statusText = () => {
        if (proposal.status === "1") {
            return "Active"
        } else if (proposal.status === "2") {
            return "In Review"
        } else {
            return "Completed"
        }
    }

    let contents
    if (loading) {
        contents = <Text>Loading...</Text>
    } else if (solutionView) {
        contents = <Box direction={"row"} justify={'between'} width={'100%'}>
            <Box>
                <Text weight={'bold'}>Proposal Name</Text>
                <Text size={'small'} >{proposalData.name}</Text>
                <Text weight={'bold'}>Prize Pool</Text>
                <Text size={'small'} >{proposalData.value} (ETH)</Text>
                <Text weight={'bold'}>Status</Text>
                <Text size={'small'} >{statusText()}</Text>
            </Box>
            <Box align={'end'}>
                <Text weight={'bold'}>Problem Type</Text>
                <Text size={'small'} >{proposalData.problemType || 'Not Specified'}</Text>
                <Text weight={'bold'}>{proposalData.endDateMS < Date.now() ? "Ended" : "Ends"} On</Text>
                <Text size={'small'} >{(new Date(proposalData.endDateMS)).toLocaleString()}</Text>
                <Text weight={'bold'}>Submitted Models</Text>
                <Text size={'small'} >{proposal.solutionCount || "0"}</Text>
            </Box>
        </Box>
    } else {
        contents = <Box direction={"row"} gap={'medium'} justify={'between'} width={'100%'}>
            <Box>
                <Text weight={'bold'}>{solutionView ? 'Proposal ' : ''}Name</Text>
                <Text size={'small'} >{proposalData.name}</Text>
                <Text weight={'bold'}>Description</Text>
                <Text size={'small'} >{proposalData.description}</Text>
                <Text weight={'bold'}>Prize Pool</Text>
                <Text size={'small'} >{proposalData.value} (ETH)</Text>
            </Box>
            <Box align={'end'}>
                <Text weight={'bold'}>Problem Type</Text>
                <Text size={'small'} >{proposalData.problemType || 'Not Specified'}</Text>
                <Text weight={'bold'}>{proposalData.endDateMS < Date.now() ? "Ended" : "Ends"} On</Text>
                <Text size={'small'} >{(new Date(proposalData.endDateMS)).toLocaleString()}</Text>
                <Text weight={'bold'}>Submitted Models</Text>
                <Text size={'small'} >{proposal.solutionCount || "0"}</Text>
            </Box>
        </Box>
    }

    return <Card height={'150px'} align={"start"} pad={'small'} background={'light-1'}
                    onClick={() => onClick(proposal.cid)}>
        {contents}
    </Card>
}
