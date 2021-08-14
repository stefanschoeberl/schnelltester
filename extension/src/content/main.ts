import {Message} from "../common/Message";
import {ContactType, Gender, Person} from "../common/Person";
import {getPersons, setPersons} from "../common/PersonRepository";

chrome.runtime.onMessage.addListener((message: Message) => {
    switch (message.type) {
        case "fill":
            fillForm(message.personIndex);
            break;
        case "save":
            saveForm();
            break;
    }
});

function setTextfieldById(id: string, value: string) {
    setValue(document.getElementById(id)! as HTMLInputElement, value);
}

function getTextfieldById(id: string): string {
    return (document.getElementById(id)! as HTMLInputElement).value;
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

function setSexDropdown(gender: Gender) {
    const selectElement = document.getElementById("Sex")! as HTMLSelectElement;

    let optionText: string;
    switch (gender) {
        case Gender.Male:
            optionText = "Männlich";
            break;
        case Gender.Female:
            optionText = "Weiblich";
            break;
        case Gender.Diverse:
            optionText = "Divers";
            break;
    }

    let optionElement: HTMLOptionElement | null = null;

    for (const child of Array.from(selectElement.children)) {
        if (child.innerHTML.includes(optionText)) {
            optionElement = child as HTMLOptionElement;
        }
    }

    if (optionElement) {
        selectElement.value = optionElement.value;
        selectElement.dispatchEvent(new Event('change'));
    }
}

function getSexDropdown(): Gender | undefined {
    const select = document.getElementById("Sex")! as HTMLSelectElement;
    const selectedOption = select.querySelector(`option[value="${select.value}"]`)!;

    if (selectedOption.innerHTML.includes("Männlich")) {
        return Gender.Male;
    } else if (selectedOption.innerHTML.includes("Weiblich")) {
        return Gender.Female;
    } else if (selectedOption.innerHTML.includes("Divers")) {
        return Gender.Diverse;
    } else {
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
    setTextfieldById("Municipality", person.city);
    setTextfieldById("PhoneNumber", person.phoneNumberForContact);
    setTextfieldById("MobileNumber", person.mobileNumberForNotification);
    setTextfieldById("Email", person.email);

    const birthdayDay = person.birthday.substr(0, 2);
    const birthdayMonth = person.birthday.substr(3, 2);
    const birthdayYear = person.birthday.substr(6, 4);

    setTextfieldById("BirthDate_day", birthdayDay);
    setTextfieldById("BirthDate_month", birthdayMonth);
    setTextfieldById("BirthDate_year", birthdayYear);

    if (person.ssn.length === 4) {
        setTextfieldById("Svnr_SequenceNumber", person.ssn);
        setTextfieldById("Svnr_BirthDate", `${birthdayDay}${birthdayMonth}${birthdayYear.substr(2)}`);
    } else {
        setTextfieldById("Svnr_SequenceNumber", person.ssn.substr(0, 4));
        setTextfieldById("Svnr_BirthDate", person.ssn.substr(4, 6));
    }

    switch (person.contact) {
        case ContactType.Email:
            setRadioByValue("Email", true);
            break;
        case ContactType.SMS:
            setRadioByValue("Sms", true);
            break;
    }

    setSexDropdown(person.gender);
}

async function saveForm() {

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

    const birthdayDay = getTextfieldById("BirthDate_day").padStart(2, "0");
    const birthdayMonth = getTextfieldById("BirthDate_month").padStart(2, "0");
    const birthdayYear = getTextfieldById("BirthDate_year");

    const person: Person = {
        firstName: getTextfieldById("PreName"),
        lastName: getTextfieldById("SurName"),
        birthday: `${birthdayDay}.${birthdayMonth}.${birthdayYear}`,
        gender: gender,
        ssn: `${getTextfieldById("Svnr_SequenceNumber")}${getTextfieldById("Svnr_BirthDate")}`,
        street: getTextfieldById("Street"),
        buildingNr: getTextfieldById("BuildingNr"),
        doorNr: getTextfieldById("DoorNr"),
        stairNr: getTextfieldById("StairNr"),
        postalCode: getTextfieldById("PostalCode"),
        city: getTextfieldById("Municipality"),
        phoneNumberForContact: getTextfieldById("PhoneNumber"),
        mobileNumberForNotification: getTextfieldById("MobileNumber"),
        email: getTextfieldById("Email"),
        contact: contact,
    };

    const persons = await getPersons();
    persons.push(person);
    setPersons(persons);
}
