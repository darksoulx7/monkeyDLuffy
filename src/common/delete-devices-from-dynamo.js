const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-west-2' });

const deleteDocuments = async () => {
    let exclusiveStartKey = null;

    do {
        const queryParams = {
            "TableName": "ss-service-ss-AppTable-ss",
            "KeyConditionExpression": "#kn0 = :kv0 AND begins_with(#kn1, :kv1)",
            "Limit": 255,
            "ExpressionAttributeNames": {
                "#kn0": "pk",
                "#kn1": "sk"
            },
            "ExpressionAttributeValues": {
                ":kv0": "ORG#xxx#DEVICE",
                ":kv1": "DEVICE#"
            },
        };

        try {
            const queryResult = await dynamodb.query(queryParams).promise();
            const itemsToDelete = queryResult.Items;

            const deletePromises = itemsToDelete.map(async (item) => {
                const deleteParams = {
                    TableName: 'persistence-service-mstg-AppTable-1SZCWVIFXFOUL',
                    Key: {
                        'pk': item.pk,
                        'sk': item.sk
                    }
                };

                await dynamodb.delete(deleteParams).promise();
                console.log('Item deleted:', item.pk);
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