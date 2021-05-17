import {ContactType, Gender, Person} from "../common/Person";
import {setPersons} from "../common/PersonRepository";

const persons: Person[] = [
    {
        "firstName": "Max",
        "lastName": "Mustermann",
        "birthday": "01.02.1990",
        "gender": Gender.Male,
        "ssn": "1248",
        "street": "Musterstraße",
        "buildingNr": "1",
        "doorNr": "2",
        "stairNr": "3",
        "postalCode": "2345",
        "city": "Musterstadt",
        "phoneNumberForContact": "0123456789",
        "mobileNumberForNotification": "01123456789",
        "email": "max.mustermann@example.com",
        "contact": ContactType.Email,
    },
    {
        "firstName": "Maria",
        "lastName": "Musterfrau",
        "birthday": "03.04.2000",
        "gender": Gender.Female,
        "ssn": "5679",
        "street": "Musterweg",
        "buildingNr": "4",
        "doorNr": "5",
        "stairNr": "6",
        "postalCode": "6789",
        "city": "Musterdorf",
        "phoneNumberForContact": "0987654321",
        "mobileNumberForNotification": "09987654321",
        "email": "maria.musterfrau@example.com",
        "contact": ContactType.SMS,
    }
]

export function setupTestdata() {
    setPersons(persons);
}
