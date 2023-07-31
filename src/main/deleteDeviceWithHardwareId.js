const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

const AWS = require('aws-sdk');
const aws4 = require('aws4');
const yargs = require('yargs');
const https = require('https');

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
      console.log('Device removed from Thing Group(s) successfully');
    } else {
      console.log('Thing does not exist in any Thing Group.');
    }

    const deleteShadowParams = {
      thingName
    };
    await iotData.deleteThingShadow(deleteShadowParams).promise();
    console.log('Thing Shadow deleted successfully');

    const deleteThingParams = {
      thingName
    };
    await iot.deleteThing(deleteThingParams).promise();
    console.log('Thing deleted successfully');
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
      console.log('Device deleted from DynamoDB successfully');
    } else {
      console.log('Device not found in DynamoDB. No deletion needed.');
    }
  } catch (err) {
    console.log('Error deleting from DynamoDB:', err);
  }
}

const deleteDeviceFromElasticsearch = async (hardwareId) => {
  try {
    const path = `/${index}/_search`;
    const query = {
      query: {
        bool: {
          must: [
            {
              term: {
                "properties.serial.keyword": hardwareId
              }
            }
          ]
        }
      }
    }
    const requestOptions = {
      host,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      service: 'es',
      region: 'us-west-2',
      body: JSON.stringify(query),
    }
    const signedRequest = aws4.sign(requestOptions, credentials);
    const responseData = await makeRequest(signedRequest);
    const searchResults = JSON.parse(responseData);
    const hits = searchResults?.hits?.hits;
    if (hits && hits.length > 0) {
      let deviceId = hits[0]._id
      let path = `/${index}/_doc/${deviceId}`
      const requestOptions2 = {
        host,
        path,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        service: 'es',
        region: 'us-west-2',
      }
      const signedRequest2 = aws4.sign(requestOptions2, credentials)
      await makeRequest(signedRequest2);
      console.log('Device deleted successfully from ElaticSearch')
    } else {
      console.log('Device not found in Elastic Search. No deletion needed.')
    }
  } catch (err) {
    console.error('Error deleting from Elasticsearch:', err);
    throw err;
  }
};

const deleteDevice = async (hardwareId) => {
  try {
    await deleteDeviceFromIoT(hardwareId);
    await deleteDeviceFromDynamoDB(hardwareId);
    await deleteDeviceFromElasticsearch(hardwareId);
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
      .option('s', {
        alias: 'H',
        description: 'Hardware ID of the device to delete',
        type: 'string',
        demandOption: true
      })
      .help()
      .alias('help', 'h')
      .argv;
    const hardwareId = argv.s.trim();
    if (!hardwareId || hardwareId === '') {
      console.log('Hardware ID cannot be empty.');
      return;
    }
    await deleteDevice(hardwareId);
  } catch (err) {
    console.error('Error:', err.message);
  };
}
main();
