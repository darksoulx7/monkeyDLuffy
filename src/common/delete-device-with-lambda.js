const SFP_DEVICE_HOST = 'ssssssssu-ssssss.sss.com'
const SFP_ACCESS_KEY = 'sss'
const SFP_SECRET_ACCESS_KEY = 'sss'
const SFP_SESSION_TOKEN = 'sss'
const orgId = ''

const { Lambda } = require('aws-sdk')
const AWS = require('aws-sdk');
const aws4 = require('aws4');
const https = require('https');
const fs = require('fs');
const { forEach } = require('lodash');
const host = SFP_DEVICE_HOST;
const index = 'devices';
const accessKeyId = SFP_ACCESS_KEY;
const secretAccessKey = SFP_SECRET_ACCESS_KEY;
const sessionToken = SFP_SESSION_TOKEN;
const arr = [];
let serials = [];
const batchSize = 3000;
// const MIGRATION_CAPABILITIES = '{ "user": ["DELETE", "CREATE", "WRITE", "READ"], "device": ["DELETE", "CREATE", "WRITE", "READ"], "device-group": ["DELETE", "CREATE", "WRITE", "READ"], "content": ["DOWNLOAD", "DELETE", "CREATE", "WRITE", "READ"], "filter": ["DELETE", "CREATE", "WRITE", "READ"], "account": ["DELETE", "CREATE", "WRITE", "READ"], "activity": ["DELETE", "CREATE", "WRITE", "READ"], "content-deploy": ["DELETE", "CREATE", "WRITE", "READ"], "serialno-coupling": ["DELETE", "CREATE", "WRITE", "READ"], "content-schedule": ["DELETE", "CREATE", "WRITE", "READ"], "content-schedule-override": ["DELETE", "CREATE", "WRITE", "READ"], "role": ["DELETE", "CREATE", "WRITE", "READ"], "batch": ["APPROVAL", "OPERATION"], "eloaccess-group": ["DELETE", "CREATE", "WRITE", "READ"], "branding": ["DELETE", "CREATE", "WRITE", "READ"], "gms": ["DELETE", "CREATE", "WRITE", "READ"], "subaccount": ["DELETE", "CREATE", "WRITE", "READ"], "category": ["DELETE", "CREATE", "WRITE", "READ"] }'
const iot = new AWS.Iot({ region: 'us-west-2' });



async function searchData(orgId) {
    try {
        let scrollId = null;
        let totalCount = 0;

        while (true) {
            const path = scrollId ? `/_search/scroll` : `/${index}/_search?scroll=3m`;
            const signedRequest = aws4.sign(
                {
                    host,
                    path,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    service: 'es',
                    region: 'us-west-2',
                    body: JSON.stringify({
                        ...(!scrollId ? {
                            query: {
                                query_string: {
                                    query: orgId,
                                },
                            },
                            size: batchSize,
                            sort: [
                                {
                                    'properties.serial.keyword': {
                                        order: 'asc',
                                    },
                                },
                            ]
                        } : {}),
                        ...(scrollId ? { scroll: "3m" } : {}),
                        ...(scrollId ? { scroll_id: scrollId } : {}),
                    }),
                },
                {
                    accessKeyId,
                    secretAccessKey,
                    sessionToken,
                }
            );

            const responseData = await makeRequest(signedRequest);
            const searchResults = JSON.parse(responseData);
            const hits = searchResults?.hits?.hits;

            if (hits && hits.length > 0) {
                scrollId = searchResults._scroll_id;
                totalCount += hits.length;
                forEach(hits, (sx) => arr.push(sx._source.properties.serial));
                console.log(`Fetched ${arr.length} devices`)
            } else {
                break;


            }
        }

        // fs.writeFileSync(`${__dirname}/serials.txt`, JSON.stringify(arr));
        console.log(`Total Devices: ${totalCount}`);
        // console.log('devices ->',  arr)
        // serials = [...arr]
        // deleteThing(arr[0].toString()).then((res) => {
        //     console.log('response:',res)
        //     // await deleteDevices()
        // })
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

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

        req.write(signedRequest.body);
        req.end();
    });
}
searchData(orgId);

// async function deleteDevices() {

//     const params = {
//         FunctionName: `device-service-sfp2-deleteDevice`,
//         Payload: {
//             body: JSON.stringify({
//                 serials: serials
//             }),
//             queryStringParameters: { orgId: orgId },
//             headers: {},
//         },
//     }
//     console.log('params',params)

//     return lambdaRequest(params)
// }

// function deleteThing(thingName) {

// Build the parameters for deleting the thing
//     const params = {
//         thingName: thingName
//     };

//     return new Promise((resolve, reject) => {
//         iot.deleteThing(params, (err, data) => {
//             if (err) {
//                 console.error('Error:', err);
//                 reject(err);
//             } else {
//                 console.log();
//                 resolve(`Thing '${thingName}' deleted successfully.`)
//             }
//         });
//     })

// }

// For local development
// const lambda = new Lambda({
//     // endpoint: 'http://localhost:3002',
//     region: 'us-west-2',
// })

// const lambdaRequestContext = {
//     authorizer: {
//         capabilities: Buffer.from(
//             JSON.stringify(JSON.parse(MIGRATION_CAPABILITIES))
//         ).toString('base64'),
//     },
// }

// async function lambdaRequest(params, returnResponse = false) {
//     params.Payload.requestContext = lambdaRequestContext
//     params.Payload = JSON.stringify(params.Payload)

//     return lambda
//         .invoke(params)
//         .promise()
//         .then((response) => {
//             console.log(response)
//         })
// }