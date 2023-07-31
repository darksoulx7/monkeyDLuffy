const  { ulid } = require('ulid')
 abstract class Item {
    abstract get pk(): any
    abstract get sk(): any

    public keys() {
        return {
            pk: this.pk,
            sk: this.sk,
        }
    }
}

 class Organization extends Item {
  id: any
  oldOrgId: any
  parentId: any
  grandParentId: any
  city: any
  name: any
  address: any
  state: any
  country: any
  postal: any
  phone: any
  firstname: any
  lastname: any
  jobtitle: any
  promo_code: any
  website: any
  billingEmail: any
  siteName: any
  contactEmail: any
  timeZone: any
  billingAddress: any
  billingCity: any
  billingPostal: any
  billingCountry: any
  controlPanelPassword: any
  billingState: any
  accountType: any
  enabled: any
  controlPlanType: any
  connectPlanType: any
  plan: any
  trial: any
  teamviewerEnabled: any
  enterprise: any
  subscription: any
  trialEndDate: any
  createdAt: any
  updatedAt: any
  devices: any
  allowedDevices: any
  totalChildAllowedDevices: any
  noOfDevices: any
  settings: any
  teamViewerTenantInfo: any
  displayName: any
  logo: any
  subAccount: any
  mfa: any
  card: any
  customerId: any
  paymentMethodId: any
  mfaEnabled: any
  searchableName: any
  searchableEmail: any
  searchableCity: any
  searchableState: any
  searchableCountry: any
  searchablePostal: any
  searchableFirstName: any
  searchableLastName: any
  subscriptionStatus: any
  keyRemapOptions: any
  keyWakeupOptions: any
  mergedSubOrgs: any
  searchableAddress: any
  constructor({
    name,
    country,
    state,
    city,
    id = ulid(),
    oldOrgId,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
    trial,
    controlPlanType,
    connectPlanType,
    plan,
    parentId,
    grandParentId,
    address,
    postal,
    phone,
    firstname,
    lastname,
    jobtitle,
    promo_code,
    website,
    billingEmail,
    siteName,
    contactEmail,
    timeZone,
    billingAddress,
    billingCity,
    billingPostal,
    billingCountry,
    controlPanelPassword,
    billingState,
    accountType,
    enabled = true,
    teamviewerEnabled,
    enterprise,
    subscription,
    trialEndDate,
    devices,
    allowedDevices,
    totalChildAllowedDevices,
    noOfDevices,
    settings,
    teamViewerTenantInfo,
    displayName,
    logo,
    subAccount,
    mfa,
    card,
    customerId,
    paymentMethodId,
    mfaEnabled,
    subscriptionStatus,
    keyRemapOptions,
    keyWakeupOptions,
    mergedSubOrgs,
  }: {
    name: any
    country: any
    state: any
    city: any
    id?: any
    oldOrgId?: any
    createdAt?: any
    updatedAt?: any
    trial?: any
    controlPlanType?: any
    connectPlanType?: any
    plan?: any
    parentId?: any
    grandParentId?: any
    address?: any
    postal?: any
    phone?: any
    firstname?: any
    lastname?: any
    jobtitle?: any
    promo_code?: any
    website?: any
    billingEmail?: any
    siteName?: any
    contactEmail?: any
    timeZone?: any
    billingAddress?: any
    billingCity?: any
    billingPostal?: any
    billingCountry?: any
    controlPanelPassword?: any
    billingState?: any
    accountType?: any
    enabled?: any
    teamviewerEnabled?: any
    enterprise?: any
    subscription?: any
    trialEndDate?: any
    devices?: any
    allowedDevices?: any
    totalChildAllowedDevices?: any
    noOfDevices?: any
    settings?: any
    teamViewerTenantInfo?: any
    displayName?: any
    logo?: any
    subAccount?: any
    mfa?: any
    card?: any
    customerId?: any
    paymentMethodId?: any
    mfaEnabled?: any
    subscriptionStatus?: any
    keyRemapOptions?: any[]
    keyWakeupOptions?: any[]
    mergedSubOrgs?: any[]
  }) {
    super()
    this.id = id
    this.oldOrgId = oldOrgId
    this.name = name
    this.country = country
    this.state = state
    this.city = city
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.controlPlanType = controlPlanType
    this.connectPlanType = connectPlanType
    this.plan = plan
    this.trial = trial
    this.parentId = parentId
    this.grandParentId = grandParentId
    this.address = address
    this.postal = postal
    this.phone = phone
    this.firstname = firstname
    this.lastname = lastname
    this.jobtitle = jobtitle
    this.promo_code = promo_code
    this.website = website
    this.billingEmail = billingEmail
    this.siteName = siteName
    this.contactEmail = contactEmail
    this.timeZone = timeZone
    this.billingAddress = billingAddress
    this.billingCity = billingCity
    this.billingPostal = billingPostal
    this.billingCountry = billingCountry
    this.controlPanelPassword = controlPanelPassword
    this.billingState = billingState
    this.accountType = accountType
    this.enabled = enabled
    this.teamviewerEnabled = teamviewerEnabled
    this.enterprise = enterprise
    this.subscription = subscription
    this.trialEndDate = trialEndDate
    this.devices = devices
    this.allowedDevices = allowedDevices
    this.totalChildAllowedDevices = totalChildAllowedDevices
    this.noOfDevices = noOfDevices
    this.settings = settings
    this.teamViewerTenantInfo = teamViewerTenantInfo
    this.displayName = displayName
    this.logo = logo
    this.subAccount = subAccount
    this.mfa = mfa
    this.card = card
    this.customerId = customerId
    this.paymentMethodId = paymentMethodId
    this.mfaEnabled = mfaEnabled
    this.searchableName = name?.toLowerCase()
    this.searchableEmail = contactEmail?.toLowerCase()
    this.searchableCity = city?.toLowerCase()
    this.searchableState = state?.toLowerCase()
    this.searchableCountry = country?.toLowerCase()
    this.searchablePostal = postal?.toLowerCase()
    this.searchableFirstName = firstname?.toLowerCase()
    this.searchableLastName = lastname?.toLowerCase()
    this.subscriptionStatus = subscriptionStatus
    this.keyRemapOptions = keyRemapOptions
    this.keyWakeupOptions = keyWakeupOptions
    this.mergedSubOrgs = mergedSubOrgs
    this.searchableAddress = address?.toLowerCase()

  }

  static fromItem(item): Organization {
    if (!item) throw new Error('No item!')
    return new Organization({ ...item })
  }

  get pk(): any {
    return `ORG`
  }

  get sk(): any {
    return `ORG#${this.id}`
  }

  get gsi1pk(): any {
    return this.parentId ? `ORG#${this.parentId}#ACCOUNT` : undefined
  }

  get gsi1sk(): any {
    return this.parentId ? `ACCOUNT#${this.id}` : undefined
  }

  get gsi2pk(): any {
    return this.oldOrgId ? `OLDORGID` : undefined
  }

  get gsi2sk(): any {
    return this.oldOrgId ? this.oldOrgId : undefined
  }

  static toItem(item): Record<any, unknown> {
    return {
      pk: item.pk,
      sk: item.sk,
      gsi1pk: item.gsi1pk,
      gsi1sk: item.gsi1sk,
      gsi2pk: item.gsi2pk,
      gsi2sk: item.gsi2sk,
      ...item,
      et: 'ORGANIZATION',
    }
  }
}

const body = {
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
const org =  new Organization({ ...body })
console.log(org)