import Card from './Card'
import { Text } from 'grommet'

export default ({submission}) => {
    return <Card>
        <Text weight={'bold'}>Model Name</Text>
        <Text>{submission.name}</Text>
    </Card>
}
