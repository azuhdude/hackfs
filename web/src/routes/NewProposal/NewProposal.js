import React, {useState} from 'react'
import {Header, Heading, Box, Button, Form, TextInput, FormField} from "grommet"

export default () => {
    const [value, setValue] = React.useState({});

    const onSubmit = data => {

    }

    return <>
        <Form
            value={value}
            onChange={nextValue => setValue(nextValue)}
            onSubmit={({value}) => onSubmit(value)}>
            <Header background={'light-2'} pad={'medium'}>
                <Heading>Create a New Proposal</Heading>
                <Button primary label={'Submit'} type={'submit'}/>
            </Header>
            <Box width={'100%'} align={'center'} margin={'10px'}>
                <Box width={'400px'} justify={'start'}>
                    <FormField label={'Name'}>
                        <TextInput ref={register} name={'name'}/>
                    </FormField>
                </Box>
            </Box>
        </Form>
    </>
}
