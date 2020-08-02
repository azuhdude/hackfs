import React, {useState, useRef, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import { uploadFile } from "../../services/ipfs"
import { proposeCreate } from "../../services/web3"
import { proposalToProblemSchema } from "../../utils"
import IpfsUploader from '../../components/IpfsUploader'

import styled from 'styled-components'
import {Header, Heading, Box, Button, Form, TextInput, TextArea, FormField, Text} from "grommet"

const LeftField = styled(FormField)`
    align-items: start;
`


export default () => {
    const history = useHistory()
    const [submitting, setSubitting] = useState(false)

    const onSubmit = async data => {
        setSubitting(true)
        const schema = proposalToProblemSchema(data)
        const address = await uploadFile({content: JSON.stringify(schema)})
        console.log(`submitted proposal address ${address}`)
        console.log('submitting proposal to contract', address, data.value)
        await proposeCreate({address, value: data.value})
        setSubitting(false)
        history.push('/')
    }

    return <>
        <Form
            onSubmit={({value}) => onSubmit(value)}>
            <Header background={'light-2'} pad={'medium'}>
                <Heading>Create a New Proposal</Heading>
                <Button primary label={submitting ? 'Submitting...' : 'Submit'} type={'submit'} size={"large"}/>
            </Header>
            <Box width={'100%'} direction={'row'} justify={'center'} margin={'10px'} gap={'large'}>
                <Box align={'start'}>
                    <Box align={'center'} width={'100%'}>
                        <Heading level={2} margin={'none'}>Problem Information</Heading>
                    </Box>
                    <Text margin={'10px'}>Name and describe the problem, and set its reward bounty</Text>
                    <LeftField label={'Name'}>
                        <TextInput name={'name'} required/>
                    </LeftField>
                    <LeftField label={'Description'}>
                        <TextArea name={'description'} required/>
                    </LeftField>
                    <LeftField label={'Bounty Value (Wei)'}>
                        <TextInput name={'value'} type={'number'} required/>
                    </LeftField>
                </Box>
                <Box height={'800px'} width={'1px'} background={'dark-4'}/>
                <Box>
                    <Box gap={'medium'}>
                        <Box>
                            <Heading level={2} margin={'none'}>Problem Set Data</Heading>
                            <Text margin={'10px'}>Upload the problem set data. You can also paste an IPFS address</Text>
                        </Box>
                        <Box>
                            <IpfsUploader name={'trainX'} label={'Training Feature Data'}/>
                            <IpfsUploader name={'trainY'} label={'Training Target Data'}/>
                        </Box>
                        <Box>
                            <IpfsUploader name={'validateX'} label={'Validate Feature Data'}/>
                            <IpfsUploader name={'validateY'} label={'Validate Target Data'}/>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Form>
    </>
}
