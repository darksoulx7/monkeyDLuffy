const { Lambda } = require('aws-sdk')
const MIGRATION_CAPABILITIES = '{ "user": ["DELETE", "CREATE", "WRITE", "READ"], "device": ["DELETE", "CREATE", "WRITE", "READ"], "device-group": ["DELETE", "CREATE", "WRITE", "READ"], "content": ["DOWNLOAD", "DELETE", "CREATE", "WRITE", "READ"], "filter": ["DELETE", "CREATE", "WRITE", "READ"], "account": ["DELETE", "CREATE", "WRITE", "READ"], "activity": ["DELETE", "CREATE", "WRITE", "READ"], "content-deploy": ["DELETE", "CREATE", "WRITE", "READ"], "serialno-coupling": ["DELETE", "CREATE", "WRITE", "READ"], "content-schedule": ["DELETE", "CREATE", "WRITE", "READ"], "content-schedule-override": ["DELETE", "CREATE", "WRITE", "READ"], "role": ["DELETE", "CREATE", "WRITE", "READ"], "batch": ["APPROVAL", "OPERATION"], "eloaccess-group": ["DELETE", "CREATE", "WRITE", "READ"], "branding": ["DELETE", "CREATE", "WRITE", "READ"], "gms": ["DELETE", "CREATE", "WRITE", "READ"], "subaccount": ["DELETE", "CREATE", "WRITE", "READ"], "category": ["DELETE", "CREATE", "WRITE", "READ"] }'
// Function to generate a new serial number
function generateNewSerial(originalSerial, index) {
    return `${originalSerial}${index}`;
}

// Function to duplicate and modify the objects with unique serial numbers
function duplicateObjectsWithNewSerials(originalObject, count) {
    const result = [];
    for (let i = 1; i <= count; i++) {
        const newSerial = generateNewSerial(originalObject.serial, i);
        const duplicatedDevice = { ...originalObject, serial: newSerial, name: newSerial };
        result.push(duplicatedDevice);
    }
    return result;
}

const dummyDeviceNumber = [{
    "addressLine1": "ss",
    "city": "ss",
    "country": "IN",
    "groupId": "",
    "mode": "control",
    "name": "LUFY7000",
    "postal": "123456",
    "registeredAccount": "ss",
    "serial": "LUFY7000",
    "state": "Gujarat"
}];

const numberOfDuplicates = 10000;
const duplicatedDevices = duplicateObjectsWithNewSerials(dummyDeviceNumber[0], numberOfDuplicates);
console.log(duplicatedDevices)

const lambda = new Lambda({
    region: 'us-west-2',
})

async function addDevice(orgId) {

    const params = {
        FunctionName: `device-service-xxx-createDevicesBulk`,
        Payload: {
            body: JSON.stringify({
                "devices": duplicatedDevices
            }),
            queryStringParameters: { orgId: orgId },
            headers: {},
        },
    }
    console.log('params',params)

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

addDevice("01H3KKAAZAH1ZTR5992S5QV05T")