const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const AWS = require('aws-sdk');
const aws4 = require('aws4');
const yargs = require('yargs');
const https = require('https');
const { searchData } = require('./utils/getOrgDevices')

const credentials = new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
});

const documentClient = new AWS.DynamoDB.DocumentClient({ credentials, region: 'us-west-2' })
const iot = new AWS.Iot({ region: 'us-west-2', credentials });
const iotData = new AWS.IotData({ endpoint: process.env.MQTT_ENDPOINT, credentials, region: 'us-west-2' });
const index = process.env.INDEX
const host = process.env.HOST
const tableName = process.env.TABLE_NAME

function makeRequest(signedRequest) {
    return new Promise((resolve, reject) => {
        const req = https.request(signedRequest, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                resolve(responseData);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (signedRequest.method === 'POST' || signedRequest.method === 'PUT') {
            req.write(signedRequest.body);
        }

        req.end();
    });
}

const deleteDeviceFromIoT = async (thingName) => {
    try {
        const listThingGroupsForThingParams = {
            thingName
        };
        const { thingGroups } = await iot.listThingGroupsForThing(listThingGroupsForThingParams).promise();

        if (thingGroups && thingGroups.length > 0) {
            const deleteThingFromGroupPromises = thingGroups.map((group) => {
                const params = {
                    thingGroupName: group.groupName,
                    thingName
                };
                return iot.removeThingFromThingGroup(params).promise();
            });
            await Promise.all(deleteThingFromGroupPromises);
            console.log(`Device ${thingName} removed from Thing Group(s) successfully`);
        } else {
            console.log(`Thing ${thingName} does not exist in any Thing Group.`);
        }

        const deleteShadowParams = {
            thingName
        };
        await iotData.deleteThingShadow(deleteShadowParams).promise();
        console.log(`Thing ${thingName} Shadow deleted successfully`);

        const deleteThingParams = {
            thingName
        };
        await iot.deleteThing(deleteThingParams).promise();
        console.log(`Thing  ${thingName} deleted successfully`);
    } catch (err) {
        if (err.code === 'ResourceNotFoundException') {
            console.log('Thing does not exist.');
        } else {
            console.error('Error deleting:', err);
        }
    }
};

const deleteDeviceFromDynamoDB = async (hardwareId) => {
    try {
        const gsi2pk = `DEVICE#${hardwareId}`
        const deviceParams = {
            TableName: tableName,
            IndexName: 'gsi2',
            KeyConditionExpression: '#gsi2pk = :gsi2pk',
            ExpressionAttributeNames: {
                '#gsi2pk': 'gsi2pk',
            },
            ExpressionAttributeValues: {
                ':gsi2pk': gsi2pk,
            },
            ScanIndexForward: false,
        }
        const result = await documentClient.query(deviceParams).promise()
        const deviceExists = result?.Items?.length > 0 ? result.Items[0] : undefined
        if (deviceExists) {
            const deleteParams = {
                TableName: tableName,
                Key: {
                    pk: `${deviceExists.pk}`,
                    sk: `${deviceExists.sk}`
                }
            };
            await documentClient.delete(deleteParams).promise()
            console.log(`Device ${hardwareId} deleted from DynamoDB successfully`);
        } else {
            console.log(`Device ${hardwareId} not found in DynamoDB. No deletion needed`);
        }
    } catch (err) {
        console.log('Error deleting from DynamoDB:', err);
    }
}

const deleteDeviceFromElasticsearch = async (hardwareId) => {
    try {
        let path = `/${index}/_doc/${hardwareId}`
        const requestOptions = {
            host,
            path,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            service: 'es',
            region: 'us-west-2',
        }
        const signedRequest = aws4.sign(requestOptions, credentials)
        await makeRequest(signedRequest);
        console.log(`Device ${hardwareId} deleted successfully from ElaticSearch`)

    } catch (err) {
        console.error('Error deleting from Elasticsearch:', err);
        // throw err;
    }
};

const deleteDevice = async (hardwareIds) => {
    try {
        await Promise.all(
            hardwareIds.map(async (hardwareId) => {
                await deleteDeviceFromIoT(hardwareId);
                await deleteDeviceFromDynamoDB(hardwareId);
                await deleteDeviceFromElasticsearch(hardwareId);
            })
        );
    } catch (err) {
        if (err.code === 'ResourceNotFoundException') {
            console.log('Thing does not exist.');
        } else {
            console.error('Error deleting:', err);
        }
    }
};

const main = async () => {
    try {
        const argv = yargs
            .option('orgId', {
                alias: 'o',
                description: 'ORG ID of the device to delete',
                type: 'string',
                demandOption: true
            })
            .help()
            .alias('help', 'h')
            .argv;

            const orgId = argv.orgId;
        if (!orgId || orgId === '') {
            console.log('Org ID cannot be empty.');
            return;
        }
        console.log('ORG ID:', orgId);
        const hardwareIds = await searchData(orgId, credentials, host, index);
        await deleteDevice(hardwareIds);
    } catch (err) {
        console.error('Error:', err.message);
    };
}
main();
