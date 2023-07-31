const aws4 = require('aws4');
const https = require('https');
const fs = require('fs');
const { forEach } = require('lodash');
const host = 'ss';
const index = 'ss';
const accessKeyId = 'ss';
const secretAccessKey = 'ss/ss';
const sessionToken = '';
const arr = [];
let orgId = '01GXXD7EK32348SF4RYK85F9CC'

async function searchData(orgId, afterSearch) {
    try {
        const signedRequest = aws4.sign(
            {
                host,
                path: `/${index}/_search`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                service: 'es',
                region: 'us-west-2',
                body: JSON.stringify({
                    query: {
                        query_string: {
                            query: orgId,
                        },
                    },
                    size: 3000,
                    search_after: afterSearch ? [afterSearch] : undefined,
                    sort: [
                        {
                            'properties.serial.keyword': {
                                order: 'asc',
                            },
                        },
                    ],
                }),
            },
            {
                accessKeyId,
                secretAccessKey,
                sessionToken,
            }
        );

        const req = https.request(signedRequest, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', async () => {
                const searchResults = JSON.parse(responseData);
                const s = searchResults?.hits?.hits;
                if (s && s.length > 0) {
                    const lastSerial = s[s.length - 1]._source.properties.serial;
                    forEach(s, sx => arr.push(sx._source.properties.serial))
                    console.log(`Fetched ${arr.length} devices`)
                    await searchData(orgId, lastSerial);
                } else {
                    fs.writeFileSync(`serials.txt`, JSON.stringify(arr));
                    console.log(arr.length);
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error occurred:', error);
        });

        req.write(signedRequest.body);
        req.end();
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

searchData(orgId);

module.exports = {
    searchData,
}