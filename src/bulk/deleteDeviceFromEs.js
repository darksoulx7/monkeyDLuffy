// check and delete
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
            console.log(`Device ${hardwareId} deleted successfully from ElaticSearch`)
        } else {
            console.log(`Device ${hardwareId} not found in Elastic Search. No deletion needed.`)
        }
    } catch (err) {
        console.error('Error deleting from Elasticsearch:', err);
        throw err;
    }
};

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

// direct delete 
const deleteDeviceFromEs = async (hardwareId) => {
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
        throw err;
    }
};

const https = require('https');
const aws4 = require('aws4');

const deleteDeviceFromEs2 = async (hardwareId, credentials, host, index) => {
    try {
        // Prepare the query to delete documents by hardware ID
        const query = {
            query: {
                bool: {
                    must: [
                        {
                            term: {
                                'properties.serial.keyword': hardwareId,
                            },
                        },
                    ],
                },
            },
        };

        const requestOptions = {
            host,
            path: `/${index}/_delete_by_query`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            service: 'es',
            region: 'us-west-2',
            body: JSON.stringify(query),
        };

        const signedDeleteRequest = aws4.sign(requestOptions, credentials);
        await makeRequest(signedDeleteRequest);

        console.log(`All devices with hardware ID ${hardwareId} deleted successfully from Elasticsearch.`);
    } catch (err) {
        throw new Error(`Error deleting from Elasticsearch for hardware ID ${hardwareId}: ${err.message}`);
    }
};

// Rest of the code (makeRequest function, exports, etc.) remain the same
