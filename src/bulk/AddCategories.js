// createCategory
const { Lambda } = require('aws-sdk')
const MIGRATION_CAPABILITIES = '{ "user": ["DELETE", "CREATE", "WRITE", "READ"], "device": ["DELETE", "CREATE", "WRITE", "READ"], "device-group": ["DELETE", "CREATE", "WRITE", "READ"], "content": ["DOWNLOAD", "DELETE", "CREATE", "WRITE", "READ"], "filter": ["DELETE", "CREATE", "WRITE", "READ"], "account": ["DELETE", "CREATE", "WRITE", "READ"], "activity": ["DELETE", "CREATE", "WRITE", "READ"], "content-deploy": ["DELETE", "CREATE", "WRITE", "READ"], "serialno-coupling": ["DELETE", "CREATE", "WRITE", "READ"], "content-schedule": ["DELETE", "CREATE", "WRITE", "READ"], "content-schedule-override": ["DELETE", "CREATE", "WRITE", "READ"], "role": ["DELETE", "CREATE", "WRITE", "READ"], "batch": ["APPROVAL", "OPERATION"], "eloaccess-group": ["DELETE", "CREATE", "WRITE", "READ"], "branding": ["DELETE", "CREATE", "WRITE", "READ"], "gms": ["DELETE", "CREATE", "WRITE", "READ"], "subaccount": ["DELETE", "CREATE", "WRITE", "READ"], "category": ["DELETE", "CREATE", "WRITE", "READ"] }'

const lambda = new Lambda({
    region: 'us-west-2',
})

async function addDevice(orgId, condition) {
    const params = {
        FunctionName: `device-service-xxx-createCategory`,
        Payload: {
            body: JSON.stringify(condition),
            queryStringParameters: { orgId: orgId },
            headers: {},
        },
    }
    return lambdaRequest(params)
}

const lambdaRequestContext = {
    authorizer: {
        capabilities: Buffer.from(
            JSON.stringify(JSON.parse(MIGRATION_CAPABILITIES))
        ).toString('base64'),
    },
}

async function lambdaRequest(params, returnResponse = false) {
    params.Payload.requestContext = lambdaRequestContext
    params.Payload = JSON.stringify(params.Payload)

    return lambda
        .invoke(params)
        .promise()
        .then((response) => {
            console.log(response)
        })
}
async function main() {
    try {
        let i = 100;
        const promises = [];

        while (i < 4000) {
            let name = `Test${i}`
            let condition = { "name": name, "orgId":"01H638RATR02GRTP8DHTCYJ4PY"}
            promises.push(addDevice("01H638RATR02GRTP8DHTCYJ4PY", condition));
            i = i + 1;
        }

        await Promise.all(promises);
    } catch (err) {
        console.log(err);
    }
}

main();
