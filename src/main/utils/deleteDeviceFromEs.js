const https = require('https');
const aws4 = require('aws4');

const deleteDeviceFromEs2 = async (hardwareId,credentials, host, index) => {
    try {
        const path = `/${index}/_doc/${hardwareId}`;
        const requestOptions = {
            host,
            path,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            service: 'es',
            region: 'us-west-2',
        };
        const signedRequest = aws4.sign(requestOptions, credentials);
        await makeRequest(signedRequest);
        console.log(signedRequest)
        console.log(`Device ${hardwareId} deleted successfully from Elasticsearch`);
    } catch (err) {
        throw new Error(`Error deleting from Elasticsearch for hardwareId ${hardwareId}: ${err.message}`);
    }
};

const deleteDeviceFromEs = async (hardwareId, credentials, host, index) => {
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

        console.log(`Device ${ hardwareId } deleted successfully from Elasticsearch`);
    } catch (err) {
        throw new Error(`Error deleting from Elasticsearch for hardware ID ${hardwareId}: ${err.message}`);
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

module.exports = {
    deleteDeviceFromEs
}
