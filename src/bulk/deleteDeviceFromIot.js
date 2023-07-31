const deleteDeviceFromIoT = async (thingName) => {
    try {
        const listThingGroupsForThingParams = {
            thingName
        };
        const { thingGroups } = await iot.listThingGroupsForThing(listThingGroupsForThingParams).promise();

        if (thingGroups && thingGroups.length > 0) {
            const deleteThingFromGroupPromises = thingGroups.map((group) => {
                const params = {
                    thingGroupName: group.groupName,
                    thingName
                };
                return iot.removeThingFromThingGroup(params).promise();
            });
            await Promise.all(deleteThingFromGroupPromises);
            console.log(`Device ${thingName} removed from Thing Group(s) successfully`);
        } else {
            console.log(`Thing ${thingName} does not exist in any Thing Group.`);
        }

        const deleteShadowParams = {
            thingName
        };
        await iotData.deleteThingShadow(deleteShadowParams).promise();
        console.log(`Thing ${thingName} Shadow deleted successfully`);

        const deleteThingParams = {
            thingName
        };
        await iot.deleteThing(deleteThingParams).promise();
        console.log(`Thing  ${thingName} deleted successfully`);
    } catch (err) {
        if (err.code === 'ResourceNotFoundException') {
            console.log('Thing does not exist.');
        } else {
            console.error('Error deleting:', err);
        }
    }
};