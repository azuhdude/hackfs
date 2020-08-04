import React, {useEffect, useState} from 'react'
import {Text} from 'grommet'
import {downloadFile} from "../services/ipfs"
import {getProposal} from "../services/web3"
import Card from './Card'
import { problemSchemaToProposal} from "../utils"

export default ({address, solutionView, onClick}) => {
    console.log(address)
    const [loading, setLoading] = useState(true)
    const [proposal, setProposal] = useState(null)
    const [proposalContract, setProposalContract] = useState(null)

    console.log(proposalContract)
    const populate = async () => {
        setLoading(true)
        const proposalData = await downloadFile(address)
        setProposal(problemSchemaToProposal(JSON.parse(proposalData)))
        setProposalContract(await getProposal(address))
        setLoading(false)
    }

    useEffect(() => {
        populate()
    }, [])

    let contents
    if (loading) {
        contents = <Text>Loading...</Text>
    } else {
        contents = <>
            <Text weight={'bold'}>{solutionView ? 'Proposal ' : ''}Name</Text>
            <Text size={'small'} >{proposal.name}</Text>
            {!solutionView && <>
                <Text weight={'bold'}>Description</Text>
                <Text size={'small'} >{proposal.description}</Text>
                <Text weight={'bold'}>Prize Pool</Text>
                <Text size={'small'} >{proposal.value} (ETH)</Text>
            </>}
            {solutionView && <>
                <Text weight={'bold'}>Prize Pool</Text>
                <Text size={'small'} >{proposal.value} (ETH)</Text>
                <Text weight={'bold'}>Status</Text>
                <Text size={'small'} >{proposalContract.status === "1" ? 'Active' : 'Completed'}</Text>
            </>}
        </>
    }

    return <Card height={'150px'} align={"start"} pad={'small'} background={'light-1'}
                    onClick={() => onClick(address)}>
        {contents}
    </Card>
}
