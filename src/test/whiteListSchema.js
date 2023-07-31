// import Joi from 'joi'
const Joi = require('joi')

const EnableDisableSchema = Joi.string().valid('Enable', 'Disable')
const AppLauncherValuesSchema = Joi.string().valid(
    'Enable_Stock',
    'Enable_Show',
    'Enable',
    'Disable'
)
const GMSStatus = Joi.string().valid('gmsEnabled', 'gmsRestricted', 'aosp')
const ActionSchema = Joi.string().valid('allow', 'disallow')
const RuleType = Joi.string().valid('package launching', 'web launching')
const RulesPackageSchema = Joi.object({
    action: ActionSchema,
    name: Joi.string(),
    type: RuleType,
})

const PortSchema = Joi.object({
    type: Joi.string().valid('USB'),
    value: Joi.string().valid('Enabled', 'Disabled'),
})

const deviceOrientationSchema = Joi.string().valid(
    'auto_rotate',
    'camera_on_left',
    'camera_on_right',
    'camera_on_top',
    'camera_on_bottom'
)

const GMSAppSchema = Joi.array().items({
    adminAccess: Joi.boolean(),
    status: Joi.boolean(),
    enabled: Joi.boolean(),
    name: Joi.string(),
    pkg: Joi.string(),
    disableVisibility: Joi.boolean(),
})

const OnePortSchema = Joi.object({ port1: PortSchema })
const TwoPortSchema = OnePortSchema.keys({ port2: PortSchema })
const ThreePortSchema = TwoPortSchema.keys({ port3: PortSchema })
const FourPortSchema = ThreePortSchema.keys({ port4: PortSchema })
const FivePortSchema = FourPortSchema.keys({ port5: PortSchema })
const SixPortSchema = FivePortSchema.keys({ port6: PortSchema })
const SevenPortSchema = SixPortSchema.keys({ port7: PortSchema })

const PhoneNumberSchema = Joi.string()
    // regex from frontend: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
    //.regex(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    .error((errors) => {
        errors[0].message = 'Please enter valid phone number.'
        return errors
    })

const ReserveLogSpace = Joi.object({
    reserveLogSpace: Joi.string(),
    rev: Joi.number(),
    version: Joi.string().optional(),
})

const ResetExceptionPackages = Joi.array().error((errors) => {
    errors[0].message = 'resetExceptionPackages must be an array.'
    return errors
})

const RepeatSchema = Joi.string()
    .valid('Day', 'Week', 'Month')
    .error((errors) => {
        errors[0].message = 'repeat must be one of [Day, Week, Month].'
        return errors
    })

const NetworkDisruptionSchema = Joi.object().keys({
    status: Joi.boolean(),
    delay: Joi.number(),
    time_hour: Joi.number(),
    time_min: Joi.number(),
    version: Joi.string().optional(),
})

const WatchDogTimerSchema = Joi.object({
    networkDisruption: NetworkDisruptionSchema,
    rev: Joi.number(),
    version: Joi.string().optional(),
})

const RebootTimerSchema = Joi.object().keys({
    status: Joi.boolean(),
    timers: Joi.array().items({
        dataReset: Joi.object({
            status: Joi.boolean(),
        }).optional(),
        name: Joi.string(),
        repeat: RepeatSchema, //property fields remaining
        timeHour: Joi.number(),
        timeMin: Joi.number(),
        priority: Joi.number(),
        weekly: Joi.string(),
        monthly: Joi.number(),
        networkDisruption: NetworkDisruptionSchema.optional(),
    }),
    rev: Joi.number(),
    version: Joi.string().optional(),
})

const DeviceResetExceptionSchema = Joi.object().keys({
    resetExceptionlistStatus: EnableDisableSchema,
    resetExceptionPackages: ResetExceptionPackages,
    rev: Joi.number(),
    version: Joi.string().optional(),
})

const WebRuleSchema = Joi.object({
    action: ActionSchema,
    event: Joi.string().uri({ scheme: ['http', 'https'] }),
    type: RuleType,
})

const DisplayTimerSchema = Joi.object({
    slot: Joi.array().items({
        start: Joi.string(),
        end: Joi.string(),
    }),
})

const CaboSyncAbilitySchema = Joi.object().keys({
    caboNoProperty: Joi.number(),
    caboPropertyName: Joi.string(),
    caboPropertyValue: Joi.string(),
})

const WifiDfsSchema = Joi.object().keys({
    value: EnableDisableSchema,
    rev: Joi.number(),
    version: Joi.string().optional(),
})

const OpenValuesSchema = Joi.array().items({
    name: Joi.string(),
    value: Joi.string(),
    source: Joi.string(),
})

const KeyboardAutoCorrectSchema = Joi.object({
    value: Joi.boolean(),
    rev: Joi.number(),
    version: Joi.string().optional(),
})

const NtpUrlSchema = Joi.object({
    ntp_url: Joi.string().required().allow(''),
    rev: Joi.number().required(),
    version: Joi.string().optional(),
})

const RestrictedUserData = Joi.object({
    disabledFeatures: Joi.array(),
    encryptedPassword: Joi.string(),
    unEncryptedPassword: Joi.string(),
    restrictedUserLogin: EnableDisableSchema,
    accessRestrictionNetwork: Joi.boolean().optional(),
    accessRestrictionSetting: Joi.boolean().optional(),
    rev: Joi.number(),
})

const EstConfigSchema = Joi.object({
    status: EnableDisableSchema,
    rev: Joi.number(),
    version: Joi.string().optional(),
    estServers: Joi.array(),
})


// Apps tab
const DeviceAppsSchema = Joi.array().items({
    name: Joi.string(),
    status: Joi.boolean(),
    adminAccess: Joi.boolean().optional(),
})

const NetworkConfigSchema = Joi.object({
    network_status: EnableDisableSchema,
    rev: Joi.number(),
    network_config: Joi.array(),
    version: Joi.string().optional(),
})

const AppEnforcementSchema = {
    uninstall: Joi.array(),
    install: Joi.array(),
    rev: Joi.number(),
    version: Joi.string().optional(),
}

const contentDownloadScheduleSchema = {
    data: {
        weekday: Joi.array(),
        timeHour: Joi.number(),
        time: Joi.string(),
        timeMin: Joi.number(),
        repeat: Joi.string(),
    },
    enabled: Joi.boolean(),
    enableAllDays: Joi.boolean(),
}

const TouchSoundSchema = Joi.object().keys({
    status: EnableDisableSchema,
    version: Joi.string().optional(),
    rev: Joi.number().optional(),
})

const analyticsConfigSchema = Joi.object({
    contentMD5: Joi.string().required(),
    agentType: Joi.string().required(),
    publishPeriod: Joi.number().required(),
    sendAnalyticsDataAsDeviceAlert: Joi.boolean().required(),
    faceDetectionPeriod: Joi.number().required(),
    cameraPreviewTime: Joi.number().required(),
    orgId: Joi.string().required(),
    contentRev: Joi.string().required(),
    credentialType: Joi.string().required(),
    analyticsAppName: Joi.string().required(),
    viewId: Joi.string().required(),
    provider: Joi.string().required(),
    maxFacesToDetect: Joi.number().required(),
    analyticsAppUrl: Joi.string().required(),
    metrics: Joi.array(),
    faceToImpressionStrategy: Joi.string().required(),
    providerName: Joi.string().required(),
    trackingId: Joi.string().required(),
    dimensions: Joi.array(),
    version: Joi.string().optional(),
    rev: Joi.number().required(),
})

const DevicePortsSchema = Joi.object({
    handheldperf: OnePortSchema,
    puckpanel: TwoPortSchema,
    linford: ThreePortSchema,
    paypoint2: SevenPortSchema,
    iseries2val: OnePortSchema,
    iseries4val: SixPortSchema,
    iseries2: FivePortSchema,
    pos_nocfd: FivePortSchema,
    pos_stand: FivePortSchema,
    typecval: OnePortSchema,
    pos_hub: SixPortSchema,
    pos_cfd: FivePortSchema,
    yumtel: SevenPortSchema,
    iohub: FourPortSchema,
    iseries4perf: SixPortSchema,
    typecperf: OnePortSchema,
    flip_stand: FourPortSchema,
    backpackval: FivePortSchema,
    backpackperf: FivePortSchema,
    nohub: Joi.object().optional(),
    rev: Joi.number(),
    version: Joi.string().optional(),
})

const GmsRestrictionSchema = Joi.object({
    rev: Joi.number().required(),
    status: GMSStatus,
    gmsAppList: GMSAppSchema,
})

const BrandingSchema = Joi.object({
    rev: Joi.number().required(),
    brandTitle: Joi.string().allow(''),
    brandTitleColor: Joi.string().allow(''),
    homeHeaderType: Joi.string().allow(''),
    homeHeader: Joi.string().allow(''),
    homeHeaderDigest: Joi.string().allow(''),
    lockBackGroundType: Joi.string().allow(''),
    lockBackGround: Joi.string().allow(''),
    homeBackGroundType: Joi.string().allow(''),
    homeBackGround: Joi.string().allow(''),
    homeBackGroundDigest: Joi.string().allow(''),
    lockBackGroundDigest: Joi.string().allow(''),
    lockLogo: Joi.string().allow(''),
    homeLogo: Joi.string().allow(''),
    homeLogoDigest: Joi.string().allow(''),
    lockLogoDigest: Joi.string().allow(''),
    displayDeviceName: Joi.boolean(),
})

const CpuCoreSchema = Joi.object({
    multiCore: Joi.boolean(),
    core: Joi.number(),
    rev: Joi.number(),
    version: Joi.string().optional(),
})

const passwordSchema = Joi.string()
    .min(4)
    .error((errors) => {
        errors[0].message = 'Password cant be less than 4 characters'
        return errors
    })


const whiteListSchema = Joi.object({
    whitelistStatus: EnableDisableSchema.required(),
    rulePackages: Joi.array().items(RulesPackageSchema),
    version: Joi.string().optional(),
    webWhitelistStatus: Joi.boolean(),
    allowQueries: Joi.boolean(),
    allowFragments: Joi.boolean(),
    webBlockedURL: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .allow(''),
    webRules: Joi.array().items(WebRuleSchema),
    rev: Joi.number().required(),
})


 const deviceInputSchema = (body) => {
    const schema = Joi.object({
        //info tab
        deviceName: Joi.string(),
        contactFirstName: Joi.string().allow(''),
        contactLastName: Joi.string().allow(''),
        site: Joi.string().allow(''),
        emailAddress: Joi.string().email().allow(''),
        phoneNumber: Joi.string().min(10).max(25).allow(''),
        addressLine1: Joi.string().allow(''),
        state: Joi.string().allow(''),
        country: Joi.string().allow(''),
        serial: Joi.string(),
        //software tab
        reserveLogSpace: ReserveLogSpace,
        //reset exception tab
        deviceResetException: DeviceResetExceptionSchema,
        //reboot timer tab
        rebootTimer: RebootTimerSchema,
        watchdogTimer: WatchDogTimerSchema,
        //setting tab
        brightness: Joi.number().min(0).max(100),
        volume: Joi.number().min(0).max(100),
        navbarColor: Joi.string(),
        ntpUrl: NtpUrlSchema,
        displayTimer: DisplayTimerSchema,
        locale: Joi.string(),
        caboSyncAbility: CaboSyncAbilitySchema,
        keyboardAutocorrect: KeyboardAutoCorrectSchema,
        screenPinning: Joi.object().keys({
            status: EnableDisableSchema,
            rev: Joi.number(),
            version: Joi.string().optional(),
        }),
        allowContentDowngrade: Joi.boolean(),
        wifiDfs: WifiDfsSchema,
        webviewHardwareAccess: EnableDisableSchema,
        touchSound: TouchSoundSchema,
        openValues: Joi.object({
            openValues: OpenValuesSchema,
            deletedOpenValues: OpenValuesSchema,
            rev: Joi.number(),
        }),
        restrictedUserData: RestrictedUserData,
        controlPanelPassword: passwordSchema,
        devicePorts: DevicePortsSchema,
        gmsRestriction: GmsRestrictionSchema,
        deviceApps: DeviceAppsSchema,
        estConfig: EstConfigSchema,
        networkConfig: NetworkConfigSchema,
        appEnforcement: AppEnforcementSchema,
        contentDownloadSchedule: contentDownloadScheduleSchema,
        contentPlaylist: Joi.array(),
        groupId: Joi.string(),
        groupName: Joi.string().allow(''),
        categoryId: Joi.string(),
        categoryName: Joi.string(),
        whiteList: whiteListSchema,
        analyticsConfig: analyticsConfigSchema,
        deviceMode: Joi.string(),
        mode: Joi.string(),
        accessRestrictionPassword: Joi.string(),
        password: passwordSchema,
        showControlPanel: EnableDisableSchema,
        city: Joi.string().allow(''),
        postalCode: Joi.string().allow(''),
        stateProvince: Joi.string().allow(''),
        timeZone: Joi.object(),
        gpsCoordinate: Joi.object(),
        screenshotAbility: Joi.boolean(),
        localApp: Joi.boolean(),
        powerButton: Joi.boolean(),
        interactiveOverlay: Joi.boolean(),
        androidHome: Joi.boolean(),
        virtualKeyboard: Joi.boolean(),
        homeButton: Joi.boolean(),
        appLauncher: AppLauncherValuesSchema,
        adminPassword: Joi.object(),
        filterId: Joi.string(),
        filterName: Joi.string(),
        parentAccountName: Joi.string().min(0),
        physicalAnalytics: Joi.object(),
        delayedDeployment: Joi.object(),
        lockscreenPasscode: Joi.object(),
        contentPinning: Joi.object(),
        deviceOrientation: deviceOrientationSchema,
        cameraShortcut: Joi.boolean(),
        autoAcceptNFCAndCameraUsage: EnableDisableSchema,
        microphone: Joi.boolean(),
        updatedAt: Joi.date(),
        createdAt: Joi.date(),
        remoteControl: Joi.object(),
        mobileData: Joi.boolean(),
        inbuiltBarcodeScanner: Joi.boolean(),
        leftTriggerButton: Joi.boolean(),
        rightTriggerButton: Joi.boolean(),
        deviceKeyRemap: Joi.object(),
        deviceKeyWakeup: Joi.object(),
        branding: BrandingSchema,
        multipleAppMode: Joi.object(),
        keyWakeup: Joi.object(),
        keyRemap: Joi.object(),
        categories: Joi.array(),
        appInfo: Joi.object().optional(),
        highQualityScnsht: Joi.boolean(),
        cpuCore: CpuCoreSchema,
    }).min(1)
    return schema.validate(body)
}

const validateRequestData = (objectData) => {
    const result = deviceInputSchema(objectData)
    return result
}

const properties = {
    "groupId": "01H2THG80AGA8XKJ2ZF22ZPQHA",
    "groupName": "Test group",
    "serial": "E163021793",
    "addressLine1": "Rålambsvägen 17",
    "city": "Stockholm",
    "stateProvince": "NONE",
    "country": "SE",
    "postalCode": "10520",
    "timeZone": {},
    "contactFirstName": "Henrik",
    "contactLastName": "Engman",
    "controlPanelPassword": "1elo",
    "appInfo": {
        "id": "01H2THG2QBRWVQAJMXW22V698R",
        "orgId": "01H2THG042QPV11TYZEGZ1ZYFD",
        "contentType": "url",
        "applicationName": "MySunprime-Waterfront",
        "webViewControllerId": "0d345df2-09f4-11ee-9f46-e57a4b5a84a5",
        "url": "https://waterfront.sunprime.net/public",
        "status": "SUCCESS",
        "iconKey": "asset/01H2THG042QPV11TYZEGZ1ZYFD/01H2THG2QBRWVQAJMXW22V698R/url-icon-elo-store/_1879_a0d19020-6041-11e9-9199-316f6a3a653d.png",
        "browserSettings": {
            "urlExtConnector": "",
            "layerType": "SW",
            "pdfSupport": true,
            "showLoadingBar": true,
            "disableDownload": false,
            "userAgent": "Mozilla/5.0 (Linux; Android 7.1; EloView 2.0/MSM8953) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.68 Mobile Safari/537.36",
            "viewMode": "Form View",
            "clearCookiesOnTimeout": true,
            "ssl": false,
            "clearData": "never",
            "webViewType": "XWalk",
            "homePageTimeout": "3",
            "showNavBar": true,
            "clearUserDataOnTimeout": true,
            "virtualKeyboard": true,
            "urlExtention": "0"
        },
        "helperAppId": "0d345df2-09f4-11ee-9f46-e57a4b5a84a5",
        "helperAppName": "WebViewController",
        "contentId": "01H2THG2QBRWVQAJMXW22V698R",
        "appVersion": 1,
        "contentVersion": 1,
        "helperAppVersion": 3,
        "helperAppDigest": "md5-BgAJONuBRr3GUriSiX9v1g==",
        "urlFileIcon": "https://polaris-mstg-asset.eloci.us/01H2THG042QPV11TYZEGZ1ZYFD/01H2THG2QBRWVQAJMXW22V698R/url-icon-elo-store/_1879_a0d19020-6041-11e9-9199-316f6a3a653d.png",
        "defaultAPKUrl": "https://elostaging.blob.core.windows.net/helper-app-elo-stores/WebViewController_3.44.18.apk?sv=2022-11-02&st=2023-07-28T11%3A13%3A31Z&se=2023-08-27T11%3A13%3A31Z&sr=b&sp=r&sig=uEVWBtWqn2pKqU2wm5TBBG5C%2FgxPXHX3hIOBbuqFwSE%3D",
        "contentDigest": "md5-undefined",
        "createdAt": "2023-06-13T14:10:31.787Z",
        "contentRev": "1487841153865"
    },
    "emailAddress": "henrik.engman@ving.se",
    "homeButton": true,
    "powerButton": false,
    "screenshotAbility": true,
    "parentAccountName": "Elo Touch Solutions, Inc.",
    "deviceName": "Test-elo",
    "updatedAt": "2020-02-26T11:34:08.926Z",
    "createdAt": "2018-06-07T11:12:08.853Z",
    "brightness": 80,
    "volume": 1,
    "deviceOrientation": "camera_on_top",
    "interactiveOverlay": false,
    "localApp": false,
    "appLauncher": "Disable",
    "caboSyncAbility": {
        "caboNoProperty": 1,
        "caboPropertyName": "wifiSS",
        "caboPropertyValue": "Enable"
    },
    "androidHome": true,
    "password": "1elo",
    "displayTimer": {
        "slot": [
            {
                "start": "08:00",
                "end": "23:30"
            }
        ]
    },
    "watchdogTimer": {
        "networkDisruption": {},
        "rev": 1532603953855,
        "version": "application/vnd.com.elotouch.ic.watchdogTimer.1.15.json"
    },
    "physicalAnalytics": {},
    "contentDownloadSchedule": {
        "enabled": false,
        "enableAllDays": false
    },
    "screenPinning": {
        "status": "Enable"
    },
    "whiteList": {
        "whitelistStatus": "Disable",
        "rulePackages": [],
        "rev": 1581670700331,
        "version": "application/vnd.com.elotouch.ic.whitelist.1.20.json",
        "webWhitelistStatus": true,
        "webRules": [
            {
                "event": "https://*.airshoppen.com",
                "type": "web launching",
                "action": "allow"
            },
            {
                "event": "https://*.thomascookairlines.com",
                "type": "web launching",
                "action": "allow"
            },
            {
                "event": "http://*.sunprime.net",
                "type": "web launching",
                "action": "allow"
            },
            {
                "event": "https://*.sunprime.net",
                "type": "web launching",
                "action": "allow"
            },
            {
                "event": "http://*.sunwing.net",
                "type": "web launching",
                "action": "allow"
            },
            {
                "event": "https://*.sunwing.net",
                "type": "web launching",
                "action": "allow"
            }
        ],
        "allowQueries": true,
        "allowFragments": true,
        "webBlockedURL": "http://about:blank"
    },
    "deviceApps": [
        {
            "name": "Browser",
            "status": true
        },
        {
            "name": "Setting",
            "status": true
        },
        {
            "name": "Test Elo SDK",
            "status": true
        },
        {
            "name": "ES File Explorer",
            "status": true
        },
        {
            "name": "Peripheral test app",
            "status": true
        },
        {
            "name": "Advance Peripheral",
            "status": true
        },
        {
            "name": "Websocket Test App",
            "status": true
        },
        {
            "name": "Youtube",
            "status": true
        },
        {
            "name": "Playstore",
            "status": true
        },
        {
            "name": "Snapdragon Camera",
            "status": true
        },
        {
            "name": "BarCode Scanner",
            "status": true
        },
        {
            "name": "Payment App",
            "status": true
        },
        {
            "name": "Elo BatteryManagement App",
            "status": true
        }
    ],
    "showControlPanel": "Enable",
    "contentPlaylist": [
        {
            "contentInfo": {
                "id": "01H2THG3HEC37VDV562NMMM9HS",
                "orgId": "01H2THG042QPV11TYZEGZ1ZYFD",
                "contentType": "video",
                "applicationName": "SP Concept Ving Sverige",
                "appVersion": 1,
                "folderName": "_1879_42390321-0edc-11ed-9382-55cbdec4e0e8.mp4",
                "helperAppId": "0599181bb7b2b4b7889d01f6dc62af7e",
                "mediaContentId": "01H2THG3HEC37VDV562NMMM9HS",
                "helperAppName": "VideoPlayer",
                "contentId": "01H2THG3HEC37VDV562NMMM9HS",
                "contentVersion": 1,
                "helperAppVersion": 2,
                "helperAppDigest": "md5-VgKdtkXe/8lA/zBSw2xJRA==",
                "urlFileIcon": "polaris-mstg-asset.eloci.us/01H2THG042QPV11TYZEGZ1ZYFD/01H2THG3HEC37VDV562NMMM9HS/media-icon-elo-store/_1879_42390320-0edc-11ed-9382-55cbdec4e0e8.png",
                "defaultAPKUrl": "https://polaris-mstg-asset.eloci.us/helpers/VideoPlayer_3_50_14.apk",
                "staticContentUrl": "https://elostaging.blob.core.windows.net/media-elo-store/_1879_42390321-0edc-11ed-9382-55cbdec4e0e8.mp4?sv=2022-11-02&st=2023-07-28T11%3A13%3A35Z&se=2023-08-27T11%3A13%3A35Z&sr=b&sp=r&sig=GEzhlxcWIVRtPpHXbnMQmGSQLR2xOy2yQ1GUD4SepMQ%3D",
                "contentDigest": "md5-bZBNIUwtLwcaLuITqL6KLg==",
                "createdAt": "2023-06-13T14:10:32.622Z",
                "status": "SUCCESS",
                "size": 213726349,
                "iconKey": "asset/01H2THG042QPV11TYZEGZ1ZYFD/01H2THG3HEC37VDV562NMMM9HS/media-icon-elo-store/_1879_42390320-0edc-11ed-9382-55cbdec4e0e8.png",
                "fileKey": "01H2THG042QPV11TYZEGZ1ZYFD/01H2THG3HEC37VDV562NMMM9HS/media-elo-store/_1879_42390321-0edc-11ed-9382-55cbdec4e0e8.mp4",
                "contentRev": "1487841153865"
            },
            "name": "TEST2",
            "oldScheduleId": "059ec4f5a2262042171d45502d7a2d50",
            "description": "Migrated schedule",
            "schedule": {
                "always": true,
                "startFrom": "2023-7-28",
                "timeStart": "00:00",
                "timeHourStart": "00",
                "timeMinStart": "00",
                "repeat": "Week",
                "weekday": [],
                "isOverride": false
            },
            "priority": 1,
            "scheduleId": "01H2THG7MBV36W305XMDY0F2ND"
        },
        {
            "contentInfo": {
                "id": "01H2THG3HEC37VDV562NMMM9HS",
                "orgId": "01H2THG042QPV11TYZEGZ1ZYFD",
                "contentType": "video",
                "applicationName": "SP Concept Ving Sverige",
                "appVersion": 1,
                "folderName": "_1879_42390321-0edc-11ed-9382-55cbdec4e0e8.mp4",
                "helperAppId": "0599181bb7b2b4b7889d01f6dc62af7e",
                "mediaContentId": "01H2THG3HEC37VDV562NMMM9HS",
                "helperAppName": "VideoPlayer",
                "contentId": "01H2THG3HEC37VDV562NMMM9HS",
                "contentVersion": 1,
                "helperAppVersion": 2,
                "helperAppDigest": "md5-VgKdtkXe/8lA/zBSw2xJRA==",
                "urlFileIcon": "polaris-mstg-asset.eloci.us/01H2THG042QPV11TYZEGZ1ZYFD/01H2THG3HEC37VDV562NMMM9HS/media-icon-elo-store/_1879_42390320-0edc-11ed-9382-55cbdec4e0e8.png",
                "defaultAPKUrl": "https://polaris-mstg-asset.eloci.us/helpers/VideoPlayer_3_50_14.apk",
                "staticContentUrl": "https://elostaging.blob.core.windows.net/media-elo-store/_1879_42390321-0edc-11ed-9382-55cbdec4e0e8.mp4?sv=2022-11-02&st=2023-07-28T11%3A13%3A39Z&se=2023-08-27T11%3A13%3A39Z&sr=b&sp=r&sig=hllmkYeDKpabtm8wPGIlEqeq7VTayRWNr%2Fhy4Wv0I4E%3D",
                "contentDigest": "md5-bZBNIUwtLwcaLuITqL6KLg==",
                "createdAt": "2023-06-13T14:10:32.622Z",
                "status": "SUCCESS",
                "size": 213726349,
                "iconKey": "asset/01H2THG042QPV11TYZEGZ1ZYFD/01H2THG3HEC37VDV562NMMM9HS/media-icon-elo-store/_1879_42390320-0edc-11ed-9382-55cbdec4e0e8.png",
                "fileKey": "01H2THG042QPV11TYZEGZ1ZYFD/01H2THG3HEC37VDV562NMMM9HS/media-elo-store/_1879_42390321-0edc-11ed-9382-55cbdec4e0e8.mp4",
                "contentRev": "1487841153865"
            },
            "name": "copyFrom-TEST2",
            "oldScheduleId": "059ec519b4cd89355daa9b317f9bcad2",
            "description": "Migrated schedule",
            "schedule": {
                "always": false,
                "startFrom": "2020-2-17",
                "timeStart": "00:00",
                "timeHourStart": "00",
                "timeMinStart": "00",
                "repeat": "Week",
                "weekday": [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                "isOverride": false,
                "endThru": "2058-1-1",
                "timeEnd": "23:59",
                "timeHourEnd": "23",
                "timeMinEnd": "59"
            },
            "priority": 2,
            "scheduleId": "01H2THG7PEQKZZWCDDXHE6SRHS"
        }
    ]
}
const { error } = validateRequestData(properties)
console.log(error)