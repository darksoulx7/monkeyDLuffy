const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

const deleteDocuments = async () => {
    let exclusiveStartKey = null;

    do {
        const queryParams = {
            "TableName": "persistence-service-xxx-AppTable-1CA5O15K61ZDM",
            "KeyConditionExpression": "#kn0 = :kv0",
            "Limit": 300,
            "ExpressionAttributeNames": {
                "#kn0": "pk",
            },
            "ExpressionAttributeValues": {
                ":kv0": "ORG#01H638RATR02GRTP8DHTCYJ4PY#FILTER",
            },
            "Select": "ALL_ATTRIBUTES",
            "ReturnConsumedCapacity": "TOTAL"
        };

        try {
            const queryResult = await dynamodb.query(queryParams).promise();

            const itemsToDelete = queryResult.Items;

            const deletePromises = itemsToDelete.map(async (item) => {
                const deleteParams = {
                    TableName: 'persistence-service-xxx-AppTable-1CA5O15K61ZDM',
                    Key: {
                        'pk': item.pk,
                        'sk': item.sk
                    }
                };

                await dynamodb.delete(deleteParams).promise();
                console.log('Item deleted:', item.sk);
            });

            await Promise.allSettled(deletePromises);

            exclusiveStartKey = queryResult.LastEvaluatedKey;
        } catch (error) {
            console.error('Error deleting documents:', error);
            break;
        }
    } while (exclusiveStartKey);

    console.log('Deletion process completed.');
};

deleteDocuments();