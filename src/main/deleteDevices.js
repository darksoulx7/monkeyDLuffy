const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const AWS = require('aws-sdk');
const yargs = require('yargs');
const { from, lastValueFrom } = require('rxjs');
const { bufferCount, mergeMap, mergeAll } = require('rxjs/operators');

const { searchData } = require('./utils/getOrgDevices');
const { deleteDeviceFromEs } = require('./utils/deleteDeviceFromEs');
const { deleteDeviceFromIoT } = require('./utils/deleteDeviceFromIoT');
const { deleteDeviceFromDynamoDB } = require('./utils/deleteDeviceFromDynamo');

// AWS Configuration
const credentials = new AWS.Credentials({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
});

const sharedConfig = {
  credentials,
  region: 'us-west-2',
};

const documentClient = new AWS.DynamoDB.DocumentClient(sharedConfig);
const iot = new AWS.Iot(sharedConfig);
const iotData = new AWS.IotData({ endpoint: process.env.MQTT_ENDPOINT, ...sharedConfig });
const index = process.env.INDEX;
const host = process.env.HOST;
const tableName = process.env.TABLE_NAME;

// Delete device from all services
const deleteDevice = async (hardwareIds) => {
  try {
    const chunkSize = 50;

    // Using RxJS to handle parallel calls with chunks
    await lastValueFrom(
      from(hardwareIds).pipe(
        // Use bufferCount to create chunks of a specific size
        bufferCount(chunkSize),
        // Use mergeMap to process each chunk in parallel
        mergeMap((chunk) => {
          const deleteIoTObservables = chunk.map((hardwareId) => deleteDeviceFromIoT(hardwareId, iot, iotData));
          const deleteDynamoDBObservables = chunk.map((hardwareId) => deleteDeviceFromDynamoDB(hardwareId, tableName, documentClient));
          const deleteEsObservables = chunk.map((hardwareId) => deleteDeviceFromEs(hardwareId, credentials, host, index));

          return from([deleteIoTObservables, deleteDynamoDBObservables, deleteEsObservables]).pipe(
            mergeAll()
          );
        })
      )
    );

    console.log('All devices deleted successfully.');
  } catch (err) {
    console.error('Error during deletion:', err.message);
  }
};


// Main function
const main = async () => {
  try {
    // Parse command-line arguments
    const argv = yargs
      .option('orgId', {
        alias: 'o',
        description: 'ORG ID of the device to delete',
        type: 'string',
        demandOption: true,
      })
      .help()
      .alias('help', 'h').argv;

    const orgId = argv.orgId;
    if (!orgId || orgId.trim() === '') {
      console.log('Org ID cannot be empty.');
      return;
    }
    console.log('ORG ID:', orgId);

    // Retrieve hardware IDs from Elasticsearch based on the given orgId
    const hardwareIds = await searchData(orgId, credentials, host, index);
    console.log('Hardware IDs:', hardwareIds)
    if (hardwareIds.length === 0) {
      console.log(`No devices found for orgId ${orgId}.`);
      return;
    }

    while (hardwareIds.length > 0) {
      await deleteDevice(hardwareIds);
      hardwareIds = await searchData(orgId, credentials, host, index);
      console.log('Hardware IDs:', hardwareIds);
    }
    console.log('All devices deleted successfully.');
  } catch (err) {
    console.error('Error:', err.message);
  }
};

main();
