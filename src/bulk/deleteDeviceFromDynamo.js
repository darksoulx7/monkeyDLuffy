const deleteDeviceFromDynamoDB = async (hardwareId) => {
    try {
        const gsi2pk = `DEVICE#${hardwareId}`
        const deviceParams = {
            TableName: tableName,
            IndexName: 'gsi2',
            KeyConditionExpression: '#gsi2pk = :gsi2pk',
            ExpressionAttributeNames: {
                '#gsi2pk': 'gsi2pk',
            },
            ExpressionAttributeValues: {
                ':gsi2pk': gsi2pk,
            },
            ScanIndexForward: false,
        }
        const result = await documentClient.query(deviceParams).promise()
        const deviceExists = result?.Items?.length > 0 ? result.Items[0] : undefined
        if (deviceExists) {
            const deleteParams = {
                TableName: tableName,
                Key: {
                    pk: `${deviceExists.pk}`,
                    sk: `${deviceExists.sk}`
                }
            };
            await documentClient.delete(deleteParams).promise()
            console.log(`Device ${hardwareId} deleted from DynamoDB successfully`);
        } else {
            console.log(`Device ${hardwareId} not found in DynamoDB. No deletion needed`);
        }
    } catch (err) {
        console.log('Error deleting from DynamoDB:', err);
    }
}