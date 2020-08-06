export const proposalToProblemSchema = (data) => {
    const {name, description, problemType, value, trainX, trainY, validateX, validateY, endDateMS, evaluation} = data
    return {
        name,
        bounty: value,
        type: problemType,
        endDate: endDateMS,
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
        },
        evaluation: {
            evaluation_script: evaluation
        }
    }
}

export const problemSchemaToProposal = (data) => {
    return {
        name: data.name,
        description: data.statement.short,
        endDateMS: data.endDate,
        problemType: data.type,
        value: data.bounty,
        trainX: data.data.train.x.path,
        trainY: data.data.train.x.path,
        validateX: data.data.validation.x.path,
        validateY: data.data.validation.x.path,
        evaluation: data.evaluation?.evaluation_script
    }
}
