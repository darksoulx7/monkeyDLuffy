import { ulid } from 'ulid'

export abstract class Item {
    abstract get pk(): string
    abstract get sk(): string

    public keys() {
        return {
            pk: this.pk,
            sk: this.sk,
        }
    }
}

export class Organization extends Item {
    id: string
    oldOrgId: string
    parentId: string
    grandParentId: string
    city: string
    name: string
    address: string
    state: string
    country: string
    postal: string
    phone: string
    firstname: string
    lastname: string
    jobtitle: string
    promo_code: string
    website: string
    billingEmail: string
    siteName: string
    contactEmail: string
    timeZone: string
    billingAddress: string
    billingCity: string
    billingPostal: string
    billingCountry: string
    controlPanelPassword: string
    billingState: string
    accountType: string
    enabled: boolean
    controlPlanType: string
    connectPlanType: string
    plan: any
    trial: string
    teamviewerEnabled: boolean
    enterprise: boolean
    subscription: string
    trialEndDate: string
    createdAt: string
    updatedAt: string
    devices: number
    allowedDevices: number
    totalChildAllowedDevices: number
    noOfDevices: string
    settings: any
    teamViewerTenantInfo: any
    displayName: string
    logo: string
    subAccount: string
    mfa: boolean
    card: any
    customerId: string
    paymentMethodId: string
    mfaEnabled: boolean
    searchableName: string
    searchableEmail: string
    searchableCity: string
    searchableState: string
    searchableCountry: string
    searchablePostal: string
    searchableFirstName: string
    searchableLastName: string
    subscriptionStatus: string
    keyRemapOptions: any[]
    keyWakeupOptions: any[]
    mergedSubOrgs: any[]
    searchableAddress: string
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
        name: string
        country: string
        state: string
        city: string
        id?: string
        oldOrgId?: string
        createdAt?: string
        updatedAt?: string
        trial?: string
        controlPlanType?: string
        connectPlanType?: string
        plan?: any
        parentId?: string
        grandParentId?: string
        address?: string
        postal?: string
        phone?: string
        firstname?: string
        lastname?: string
        jobtitle?: string
        promo_code?: string
        website?: string
        billingEmail?: string
        siteName?: string
        contactEmail?: string
        timeZone?: string
        billingAddress?: string
        billingCity?: string
        billingPostal?: string
        billingCountry?: string
        controlPanelPassword?: string
        billingState?: string
        accountType?: string
        enabled?: boolean
        teamviewerEnabled?: boolean
        enterprise?: boolean
        subscription?: string
        trialEndDate?: string
        devices?: number
        allowedDevices?: number
        totalChildAllowedDevices?: number
        noOfDevices?: string
        settings?: string
        teamViewerTenantInfo?: any
        displayName?: string
        logo?: string
        subAccount?: string
        mfa?: boolean
        card?: any
        customerId?: string
        paymentMethodId?: string
        mfaEnabled?: boolean
        subscriptionStatus?: string
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

    get pk(): string {
        return `ORG`
    }

    get sk(): string {
        return `ORG#${this.id}`
    }

    get gsi1pk(): string {
        return this.parentId ? `ORG#${this.parentId}#ACCOUNT` : undefined
    }

    get gsi1sk(): string {
        return this.parentId ? `ACCOUNT#${this.id}` : undefined
    }

    get gsi2pk(): string {
        return this.oldOrgId ? `OLDORGID` : undefined
    }

    get gsi2sk(): string {
        return this.oldOrgId ? this.oldOrgId : undefined
    }

    static toItem(item): Record<string, unknown> {
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
