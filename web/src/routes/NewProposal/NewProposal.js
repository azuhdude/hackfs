import React from 'react'
import { Header, Heading, Box, Button } from "grommet"
import { useForm } from "react-hook-form"
import Text from '../../components/Text'

export default () => {
    const { register, handleSubmit } = useForm()

    const onSubmit = data => {

    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Header background={'light-2'} pad={'medium'}>
                <Heading>Create a New Proposal</Heading>
                <Button primary label={'Submit'} type={'submit'}/>
            </Header>
            <Box width={'100%'} align={'center'} margin={'10px'}>
                <Box width={'400px'} justify={'start'}>
                        <Text label={'Name'} register={register}/>
                </Box>
            </Box>
        </form>
    </>
}
