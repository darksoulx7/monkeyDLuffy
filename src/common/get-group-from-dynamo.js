const AWS = require('aws-sdk');
const { forEach } = require('lodash');
const dynamodb = new AWS.DynamoDB.DocumentClient({ 
    region: 'us-west-2',
 });
let TotalGroups = []
const getGroups = async () => {
    let exclusiveStartKey = null;
    do { 
        const queryParams = {
            "TableName": "ss-service-mstg-AppTable-1SZCWVIFXFOUL",
            "KeyConditionExpression": "pk = :pk AND begins_with(sk, :sk)",
            "Limit": 255,
            "ExpressionAttributeValues": {
                ":pk": "sss#01GYB086J1ET884T9XRD4TYNK7#GROUP",
                ":sk": "GROUP#"
            },
            "ExclusiveStartKey": exclusiveStartKey || null,
        };
        try {
            const result = await dynamodb.query(queryParams).promise();
            forEach(result?.Items, item => {
                // console.log("Fetched ", item?.sk);
                TotalGroups.push(item?.name)
            }
            )
            exclusiveStartKey = result.LastEvaluatedKey;
        } catch (error) {
            console.error('Error Fetching documents:', error);
            break;
        }
    } while (exclusiveStartKey)
    console.log('process completed.');
};

const faultyGroups = []

const getDummyGroupData = async () => {
    // let exclusiveStartKey = null;
    let count= 0 
    while (count < TotalGroups.length) {
        let group = await getDeviceGroupByGroupName(TotalGroups[count], "01GYB086J1ET884T9XRD4TYNK7");
        // console.log('group',group)
        if(Object.keys(group).length < 3 && group.sk) {
            faultyGroups.push(group.sk.slice(group.sk.lastIndexOf("#") + 1))
        }
        count += 1
    }

    return faultyGroups
};


getGroups().then(() => {
     const data = getDummyGroupData();
    console.log('data', data)

}).catch(err => {
    console.log(`Error: ${err}`)
});

const getDeviceGroupByGroupName = async (groupName, orgId) => {
    if (!groupName) return false
    const uniqueGroupNameKey = `UNIQUE#ORG#${orgId}#GROUP#NAME#${groupName.toLowerCase()}`
    const params = {
        TableName: "persistence-service-mstg-AppTable-1SZCWVIFXFOUL",
        KeyConditionExpression: 'pk = :pk and sk = :sk',
        ExpressionAttributeValues: {        
            ':pk': uniqueGroupNameKey,
            ':sk': uniqueGroupNameKey,
        },
        ScanIndexForward: false,
    }
    const groupDoc = await dynamodb.query(params).promise()
    if (!groupDoc) return false
    if (groupDoc.Items?.length > 0) return groupDoc.Items[0]
}

