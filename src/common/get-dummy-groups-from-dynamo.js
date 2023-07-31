const AWS = require('aws-sdk');
const { chunk } = require('lodash');
const dynamodb = new AWS.DynamoDB.DocumentClient({
    region: 'us-west-2',
});

const processGroups = async () => {
    const orgId = "ss";
    const tableName = "ss-service-mstg-AppTable-1SZCWVIFXFOUL";
    const batchSize = 25; // Adjust batch size as needed

    let exclusiveStartKey = null;
    const faultyGroups = [];

    do {
        const queryParams = {
            TableName: tableName,
            KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
            Limit: batchSize,
            ExpressionAttributeValues: {
                ":pk": `ORG#${orgId}#GROUP`,
                ":sk": "GROUP#",
            },
            ExclusiveStartKey: exclusiveStartKey,
        };

        try {
            const result = await dynamodb.query(queryParams).promise();
            const groupNames = result.Items.map(item => item.name.toLowerCase());
            const chunkedGroupNames = chunk(groupNames, batchSize);

            for (const chunkedGroup of chunkedGroupNames) {
                const groupDocs = await Promise.all(
                    chunkedGroup.map(groupName =>
                        getDeviceGroupByGroupName(groupName, orgId)
                    )
                );

                groupDocs.forEach((group, index) => {
                    if (Object.keys(group).length < 3 && group.sk) {
                        faultyGroups.push(group.sk.slice(group.sk.lastIndexOf("#") + 1));
                    }
                });
            }

            exclusiveStartKey = result.LastEvaluatedKey;
        } catch (error) {
            console.error('Error Fetching documents:', error);
            break;
        }
    } while (exclusiveStartKey);

    console.log('Faulty process completed.', faultyGroups);
};

const getDeviceGroupByGroupName = async (groupName, orgId) => {
    if (!groupName) return false;
    const uniqueGroupNameKey = `UNIQUE#ORG#${orgId}#GROUP#NAME#${groupName}`;

    const params = {
        TableName: "xxx-service-xxx-AppTable-xxx",
        KeyConditionExpression: 'pk = :pk and sk = :sk',
        ExpressionAttributeValues: {
            ':pk': uniqueGroupNameKey,
            ':sk': uniqueGroupNameKey,
        },
        ScanIndexForward: false,
    };

    const groupDoc = await dynamodb.query(params).promise();
    if (!groupDoc || groupDoc.Items.length === 0) return false;

    return groupDoc.Items[0];
};

processGroups().catch(err => {
    console.log(`Error: ${err}`);
});
