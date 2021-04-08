import {Message, MissingData} from "../common/Message";
import {ContactType, Gender, Person} from "../common/Person";
import {getPersons, setPersons} from "../common/PersonRepository";
import {supportedPages} from "../util/supportedPages";

const currentPageInfo = supportedPages.find((page) => window.location.href.match(page.regex))!!;

chrome.runtime.onMessage.addListener((message: Message) => {
    switch (message.type) {
        case "fill":
            fillForm(message.personIndex);
            break;
        case "save":
            saveForm(message.missingData);
            break;
    }
});

function setTextfieldById(id: string, value: string) {
    setValue(document.getElementById(id)! as HTMLInputElement, value);
}

function getTextfieldById(id: string): string {
    return (document.getElementById(id)! as HTMLInputElement).value;
}

function setTextfieldByPlaceholder(placeholder: string, value: string) {
    setValue(document.querySelector(`input[type='text'][placeholder='${placeholder}']`)! as HTMLInputElement, value);
}

function getTextfieldByPlaceholder(placeholder: string): string {
    return (document.querySelector(`input[type='text'][placeholder='${placeholder}']`)! as HTMLInputElement).value;
}

function setValue(element: HTMLInputElement, value: string) {
    element.value = value;
    element.dispatchEvent(new Event("input"));
}

function setRadioByValue(value: string, checked: boolean) {
    const element = document.querySelector(`input[type='radio'][value='${value}']`)! as HTMLInputElement;
    element.checked = checked;
    element.dispatchEvent(new Event("change"));
}

function getRadioByValue(value: string): boolean {
    return (document.querySelector(`input[type='radio'][value='${value}']`)! as HTMLInputElement).checked;
}

function getContactType(): ContactType | undefined {
    if (getRadioByValue("Email")) {
        return ContactType.Email;
    } else if (getRadioByValue("Sms")) {
        return ContactType.SMS;
    } else {
        return undefined;
    }
}

function getEducationPersonal(): boolean | undefined {
    if (getRadioByValue("true")) {
        return true;
    } else if (getRadioByValue("false")) {
        return false;
    } else {
        return undefined;
    }
}

function setSexDropdown(gender: Gender) {
    (document.getElementById("sex")!.firstChild! as HTMLElement).click();
    let label: string;
    switch (gender) {
        case Gender.Male:
            label = "Männlich"
            break;
        case Gender.Female:
            label = "Weiblich";
            break;
        case Gender.Diverse:
            label = "Divers";
            break;
    }

    (document.querySelector(`#sex li[aria-label='${label}']`)! as HTMLElement).click();
}

function getSexDropdown(): Gender | undefined {
    switch (document.querySelector("#sex input")!.getAttribute("aria-label")) {
        case "Männlich":
            return Gender.Male;
        case "Weiblich":
            return Gender.Female;
        case "Divers":
            return Gender.Diverse;
        default:
            return undefined;
    }
}

async function fillForm(personIndex: number) {
    const person = (await getPersons())[personIndex];

    setTextfieldById("PreName", person.firstName);
    setTextfieldById("SurName", person.lastName);
    setTextfieldById("Street", person.street);
    setTextfieldById("BuildingNr", person.buildingNr);
    setTextfieldById("DoorNr", person.doorNr);
    setTextfieldById("StairNr", person.stairNr);
    setTextfieldById("PostalCode", person.postalCode);
    setTextfieldById("municipality", person.city);
    setTextfieldById("phoneNumber", person.phoneNumberForContact);
    setTextfieldById("MobileNumber", person.mobileNumberForNotification);
    setTextfieldById("Email", person.email);

    setTextfieldByPlaceholder("XXXX", person.ssn);
    setTextfieldByPlaceholder("TT.MM.JJJJ", person.birthday);

    switch (person.contact) {
        case ContactType.Email:
            setRadioByValue("Email", true);
            break;
        case ContactType.SMS:
            setRadioByValue("Sms", true);
            break;
    }

    if (currentPageInfo.withEducationPersonal) {
        if (person.educationPersonal) {
            setRadioByValue("true", true);
        } else {
            setRadioByValue("false", true);
        }
    }

    setSexDropdown(person.gender);
}

async function saveForm(missingData: MissingData | undefined) {

    const gender = getSexDropdown();
    if (gender === undefined) {
        alert('Fehler bei Geschlecht - Speichern fehlgeschlagen!');
        return;
    }

    const contact = getContactType();
    if (contact === undefined) {
        alert('Fehler bei: "Bitte teilen Sie uns mit, wie wir Sie für die Anmeldung kontaktieren sollen." - Speichern fehlgeschlagen!');
        return;
    }

    let educationPersonal: boolean | undefined;
    if (currentPageInfo.withEducationPersonal) {
        educationPersonal = getEducationPersonal();
        if (educationPersonal === undefined) {
            alert('Fehler bei: "Gehören Sie zum Bildungspersonal in Österreich?" - Speichern fehlgeschlagen!');
            return;
        }
    } else {
        educationPersonal = missingData!!.educationPersonal!!;
    }

    const person: Person = {
        firstName: getTextfieldById("PreName"),
        lastName: getTextfieldById("SurName"),
        birthday: getTextfieldByPlaceholder("TT.MM.JJJJ"),
        gender: gender,
        ssn: getTextfieldByPlaceholder("XXXX"),
        street: getTextfieldById("Street"),
        buildingNr: getTextfieldById("BuildingNr"),
        doorNr: getTextfieldById("DoorNr"),
        stairNr: getTextfieldById("StairNr"),
        postalCode: getTextfieldById("PostalCode"),
        city: getTextfieldById("municipality"),
        phoneNumberForContact: getTextfieldById("phoneNumber"),
        mobileNumberForNotification: getTextfieldById("MobileNumber"),
        email: getTextfieldById("Email"),
        contact: contact,
        educationPersonal: educationPersonal
    }

    const persons = await getPersons();
    persons.push(person);
    setPersons(persons);
}
