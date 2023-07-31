const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
const aws4 = require('aws4');
const https = require('https');
const { forEach } = require('lodash');


const arr = [];
const batchSize = 3000;

const makeQuery = (orgId, scrollId) => {
    return {
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
    }
}

module.exports.searchData =  async (orgId, credentials, host, index)  => {
    try {
        let scrollId = null;
        let totalCount = 0;

        while (true) {
            const path = scrollId ? `/_search/scroll` : `/${index}/_search?scroll=3m`;
            let query = makeQuery(orgId, scrollId)
            let requestOptions = {
                host,
                path,
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                service: 'es',
                region: 'us-west-2',
                body: JSON.stringify(query),
            }
            const signedRequest = aws4.sign(requestOptions, credentials);
            const responseData = await makeRequest(signedRequest);
            const searchResults = JSON.parse(responseData);
            const hits = searchResults?.hits?.hits;

            if (hits && hits.length > 0) {
                scrollId = searchResults._scroll_id;
                totalCount += hits.length;
                forEach(hits, (sx) => arr.push(sx._source.properties.serial));
            } else {
                console.log(`Total Devices: ${totalCount}`);
                break;
            }
        }
        
        return arr

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

// for writing array into text file
// const fs = require('fs');
// fs.writeFileSync(`serials.txt`, JSON.stringify(arr));