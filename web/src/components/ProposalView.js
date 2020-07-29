import React from 'react'
import {Box, Heading, Text} from 'grommet'
import styled from 'styled-components'
import Card from './Card'

export default ({proposal, onClick}) => {
    return <Card height={'150px'} align={"start"} pad={'small'} background={'light-1'}
                    onClick={() => onClick(proposal.address)}>
        <Text weight={'bold'}>Name</Text>
        <Text size={'small'} >{proposal.name}</Text>
        <Text weight={'bold'}>Description</Text>
        <Text size={'small'} >{proposal.description}</Text>
        <Text weight={'bold'}>Prize Pool</Text>
        <Text size={'small'} >{proposal.value}</Text>
    </Card>
}
