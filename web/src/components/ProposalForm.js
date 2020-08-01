import { Form, Text } from 'informed';
import React from 'react'

export default ({onSubmit}) => {
    return <div>
        <Form onSubmit={onSubmit}>
            <label>
                Proposal Name:
                <Text field="name"/>
            </label>
            <label>
                Proposal Description:
                <Text field="description"/>
            </label>
            <button type="submit">Submit</button>
        </Form>
    </div>
}
