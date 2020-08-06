import React, {useState } from 'react'
import {useHistory} from 'react-router-dom'
import { uploadFile } from "../../services/ipfs"
import { uploadJSON } from '../../services/pinata'
import { proposeCreate } from "../../services/web3"
import { proposalToProblemSchema } from "../../utils"
import IpfsUploader from '../../components/IpfsUploader'

import styled from 'styled-components'
import {Header, Heading, Box, Button, Form, TextInput, TextArea, FormField, Text, DateInput, Select} from "grommet"

const LeftField = styled(FormField)`
    align-items: start;
`


export default () => {
    const history = useHistory()
    const [submitting, setSubitting] = useState(false)

    const onSubmit = async data => {
        const submissionData = {
            ...data,
            endDateMS: (new Date(data.endDateMS)).getTime()
        }
        console.log(submissionData)

        setSubitting(true)
        const schema = proposalToProblemSchema(submissionData)
        const address = await uploadJSON(JSON.stringify(schema))
        console.log(`submitted proposal address ${address}`)
        console.log('submitting proposal to contract', address, submissionData.value)
        await proposeCreate({address, value: submissionData.value, endDateMS: submissionData.endDateMS})
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
                    <LeftField label={'Problem Type'}>
                        <Select
                            name={'problemType'}
                            options={[
                                'Regression',
                                'Classification',
                                'Image - Object Detection',
                                'Image - Segmentation',
                                'Image - Classification']}
                        />
                    </LeftField>
                    <LeftField label={'End Date'}>
                        <DateInput
                            format="mm/dd/yyyy"
                            name='endDateMS'
                        />
                    </LeftField>
                    <LeftField label={'Bounty Value (ETH)'}>
                        <TextInput name={'value'} type={'number'} step={'any'} required/>
                    </LeftField>
                </Box>
                <Box height={'800px'} width={'1px'} background={'dark-4'}/>
                <Box>
                    <Box gap={'medium'}>
                        <Box align={'center'}>
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
                        <Box>
                            <IpfsUploader name={'evaluation'} label={'Evaluation Script'}/>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Form>
    </>
}
