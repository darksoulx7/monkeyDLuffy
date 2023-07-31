const Joi = require('joi')
 const validate = (
    input,
    schema,
    validationOptions = {
        abortEarly: false, // abort after the last validation error
        allowUnknown: true, // allow unknown keys that will be ignored
        stripUnknown: true, // remove unknown keys from the validated data
    }
) => {
    const { value, error } = schema.validate(input, validationOptions)

    if (error) {
        console.error(`Invalid payload => ${error}.`)
        throw error
    }
    return value
}

 const createOrgSchema = Joi.object().keys({
    oldOrgId: Joi.string().optional(),
    parentId: Joi.string().allow(''),
    firstname: Joi.string()
        .when('parentId', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required(),
        })
        .error((errors) => {
            // errors[0].message = 'First name is required.'
            return errors
        }),
    lastname: Joi.string()
        .when('parentId', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required(),
        })
        .error((errors) => {
            // errors[0].message = 'Last name is required.'
            return errors
        }),
    name: Joi.string()
        .required()
        .error(([errors]) => {
            // errors[0].message = 'Business name is required.'
            return errors
        }),
    email: Joi.string()
        .required()
        .error(([errors]) => {
            // errors[0].message = 'Email is required.'
            return errors
        }),
    city: Joi.string()
        .when('parentId', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required(),
        })
        .error(([errors]) => {
            // errors[0].message = 'City is required.'
            return errors
        }),
    address: Joi.string()
        .when('parentId', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required(),
        })
        .error(([errors]) => {
            // errors[0].message = 'Address is required.'
            return errors
        }),
    state: Joi.string().allow('').optional(),
    country: Joi.string()
        .when('parentId', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required(),
        })
        .error((errors) => {
            errors[0].message = 'Country is required.'
            return errors
        }),
    postal: Joi.string()
        .when('parentId', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required(),
        })
        .error((errors) => {
            errors[0].message = 'Zip code is required.'
            return errors
        }),
    phone: Joi.string()
        .when('parentId', {
            is: Joi.exist(),
            then: Joi.optional(),
            otherwise: Joi.required(),
        })
        .error((errors) => {
            errors[0].message = 'Phone is required.'
            return errors
        }),
    controlPanelPassword: Joi.string()
        .required()
        .error((errors) => {
            errors[0].message = 'Control panel password is required.'
            return errors
        }),
    jobtitle: Joi.string().allow(''),
    promo_code: Joi.string().allow(''),
    website: Joi.string().allow(''),
    billingEmail: Joi.string().allow(''),
    siteName: Joi.string().allow(''),
    contactName: Joi.string().allow(''),
    contactEmail: Joi.string().allow(''),
    timeZone: Joi.string().allow(''),
    billingAddress: Joi.string().allow(''),
    billingCity: Joi.string().allow(''),
    billingPostal: Joi.string().allow(''),
    billingCountry: Joi.string().allow(''),
    billingState: Joi.string().allow(''),
    subscription: Joi.string().allow(''),
    grand: Joi.string().allow(''),
    noOfDevices: Joi.string().allow(''),
    enterprise: Joi.boolean().optional(),
    teamviewerEnabled: Joi.boolean().optional(),
    trialEndDate: Joi.string().optional(),
    allowedDevices: Joi.number().allow(null),
    plan: Joi.object().keys({
        control: Joi.object().keys({
            allowedDeviceCount: Joi.number(),
            deviceCount: Joi.number(),
            endDate: Joi.string(),
        }),
        connect: Joi.object().keys({
            allowedDeviceCount: Joi.number(),
            deviceCount: Joi.number(),
            endDate: Joi.string(),
        }),
        core: Joi.object().keys({
            deviceCount: Joi.number(),
        }),
    }),
    customerId: Joi.string(),
    paymentMethodId: Joi.string(),
    card: Joi.object({
        last4digit: Joi.string(),
        type: Joi.string(),
    }),
    displayName: Joi.string().optional(),
})
const event = {
    "oldOrgId": "3861597110232389",
    "firstname": "ss",
    "lastname": "ss",
    "name": "ss",
    "email": "jaym.patelx+sfp33@gmail.com",
    "city": "ss",
    "address": "ss",
    "state": "ss",
    "country": "IN",
    "postal": "474372",
    "phone": "1234567899",
    "controlPanelPassword": "1elo",
    "mfa": false,
    "enabled": true,
    "contactName": "ss ss",
    "contactEmail": "jaym.patelx+sfp33@gmail.com",
    "billingAddress": "",
    "billingCity": "",
    "billingPostal": "",
    "billingCountry": "",
    "billingState": "",
    "trialEndDate": "2023-08-15T07:07:03.189Z",
    "plan": {
        "control": {
            "deviceCount": 0,
            "allowedDeviceCount": 10,
            "endDate": "2023-08-15T07:07:03.189Z"
        },
        "connect": {
            "deviceCount": 0,
            "allowedDeviceCount": 10,
            "endDate": "2023-08-15T07:07:03.189Z"
        },
        "core": {
            "deviceCount": 0
        }
    }
}

const details = validate(event, createOrgSchema)

// console.log(details)

 const isValid = (data, schema) => {
    const result = schema.validate(data)
    const isValid = result.error === null
    const errors = !result.error
        ? null
        : result.error.details.map((detail) => detail.message)
    return { result: result.value, isValid, errors }
}

 const validate2 = (
    input,
    schema,
    validationOptions  = {
        abortEarly: false, // abort after the last validation error
        allowUnknown: true, // allow unknown keys that will be ignored
        stripUnknown: true, // remove unknown keys from the validated data
    }
) => {
    const { value, error } = schema.validate(input, validationOptions)

    if (error) {
        console.error(`Invalid payload => ${error}.`)
        throw error
    }
    return value
}
 const updateOrgBody = () => {
    const schema = Joi.object({
        oldOrgId: Joi.string().optional(),
        name: Joi.string(),
        firstname: Joi.string(),
        lastname: Joi.string(),
        url: Joi.string().allow(''),
        billingEmail: Joi.string().allow(''),
        siteName: Joi.string().allow(''),
        timeZone: Joi.string().allow(''),
        billingAddress: Joi.string().allow(''),
        billingCity: Joi.string().allow(''),
        billingPostal: Joi.string().allow(''),
        billingCountry: Joi.string().allow(''),
        address: Joi.string(),
        city: Joi.string(),
        state: Joi.string().allow('').optional(),
        country: Joi.string(),
        postal: Joi.string(),
        phone: Joi.string(),
        email: Joi.string(),
        billingState: Joi.string().allow(''),
        contactEmail: Joi.string().allow(''),
        accountType: Joi.string().allow(''),
        allowedDevices: Joi.number(),
        totalChildAllowedDevices: Joi.number().optional(),
        enterprise: Joi.boolean(),
        teamviewerEnabled: Joi.boolean().optional(),
        website: Joi.string().allow(''),
        customerId: Joi.string().allow(''),
        subscription: Joi.string().allow(''),
        paymentMethodId: Joi.string().allow(''),
        trialEndDate: Joi.string().allow(null),
        subscriptionStatus: Joi.string().allow(''),
        card: Joi.object({
            last4digit: Joi.string(),
            type: Joi.string(),
        }),
        mfa: Joi.boolean(),
        controlPlanType: Joi.string().allow(''),
        connectPlanType: Joi.string().allow(''),
        plan: Joi.object({
            connect: Joi.object({
                allowedDeviceCount: Joi.number(),
                deviceCount: Joi.number(),
                priceId: Joi.string(),
                endDate: Joi.string(),
                totalChildAllowedDevices: Joi.number().optional(),
            }),
            control: Joi.object({
                allowedDeviceCount: Joi.number(),
                priceId: Joi.string(),
                deviceCount: Joi.number(),
                endDate: Joi.string(),
                totalChildAllowedDevices: Joi.number().optional(),
            }),
            core: Joi.object({
                deviceCount: Joi.number(),
            }),
        }),
        enabled: Joi.boolean(),
        displayName: Joi.string().allow(''),
        logo: Joi.string().allow(''),
        subAccount: Joi.string().allow(''),
        teamViewerTenantInfo: Joi.object().allow(null),
        promo_code: Joi.string().allow(''),
        skipSubaccounts: Joi.boolean().optional(), // migration purposes
        mergedSubOrgs: Joi.array().optional(), // migration purposes
        isMigration: Joi.boolean().optional(), // migration purposes
    })
    return schema
}

const data = {
    "firstname": "ss",
    "lastname": "ss",
    "name": "ss",
    "email": "jaym.patelx+sfpx11@gmail.com",
    "city": "ss",
    "address": "ss",
    "state": "gujarat",
    "country": "IN",
    "postal": "123456",
    "phone": "1234567890",
    "mfa": false,
    "enabled": true,
    "contactEmail": "jaym.patelx+sfpx11@gmail.com",
    "billingEmail": "jaym.patelx+sfpx11@gmail.com",
    "billingAddress": "ss",
    "billingCity": "ss",
    "billingPostal": "123456",
    "billingCountry": "IN",
    "billingState": "gujarat",
    "subscription": "sub_1NY64XKygtOlzrgXeBrfLrJS",
    "subscriptionStatus": "PAID",
    "customerId": "cus_OKlbBq473Kd4Tr",
    "paymentMethodId": "pm_1NY64UKygtOlzrgXkH2cnCOl",
    "card": {
        "last4digit": "4242",
        "type": "visa"
    },
    "plan": {
        "control": {
            "deviceCount": 0,
            "allowedDeviceCount": 2000,
            "endDate": "2023-08-26T11:40:05.000Z"
        },
        "connect": {
            "deviceCount": 0,
            "allowedDeviceCount": 2000,
            "endDate": "2023-08-26T11:40:05.000Z"
        },
        "core": {
            "deviceCount": 0
        }
    },
    "skipSubaccounts": true,
    "isMigration": true
}
const valid = isValid(data, updateOrgBody())
console.log('valid', valid)

