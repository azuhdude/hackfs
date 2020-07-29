import { useParams } from 'react-router-dom'
import { Header, Heading } from 'grommet'
import React, {useState, useEffect} from 'react'
import { downloadFile } from '../../services/ipfs'

export default () => {

    const { address } = useParams()
    const {loading, setLoading} = useState(true)

    useEffect(() => {
        (async () => {
            await downloadFile(address)
            setLoading(false)
        })()
    }, [])

    if (loading) return <h1>Loading...</h1>

    return <Header>
        <Heading>Proposal: {address}</Heading>
    </Header>
}
