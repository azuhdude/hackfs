export const proposalToProblemSchema = (data) => {
    const {name, description, value, trainX, trainY, validateX, validateY} = data
    return {
        name,
        bounty: value,
        statement: {
            short: description
        },
        data: {
            train: {
                x: {
                    path: trainX
                },
                y: {
                    path: trainY
                }
            },
            validation: {
                x: {
                    path: validateX
                },
                y: {
                    path: validateY
                }
            }
        }

    }
}

export const problemSchemaToProposal = (data) => {
    return {
        name: data.name,
        description: data.statement.short,
        value: data.bounty,
        trainX: data.data.train.x.path,
        trainY: data.data.train.x.path,
        validateX: data.data.validation.x.path,
        validateY: data.data.validation.x.path,
    }
}
