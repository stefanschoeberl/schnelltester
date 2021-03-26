export enum Gender {
    Male = "male",
    Female = "female",
    Diverse = "diverse"
}

export enum ContactType {
    Email = "email",
    SMS = "sms"
}

export interface Person {
    firstName: string,
    lastName: string,
    birthday: string,
    gender: Gender,
    ssn: string,
    street: string,
    buildingNr: string,
    doorNr: string,
    stairNr: string,
    postalCode: string,
    city: string,
    phoneNumberForContact: string,
    mobileNumberForNotification: string,
    email: string,
    contact: ContactType,
    educationPersonal: boolean
}
