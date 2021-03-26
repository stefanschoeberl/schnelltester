import {Person} from "./Person";

export function getPersons(): Promise<Person[]> {
    return new Promise<Person[]>((resolve, reject) => {
        chrome.storage.local.get(['persons'], (result) => {
            if (chrome.runtime.lastError) {
                reject();
            }

            if (result.persons) {
                resolve(result.persons);
            } else {
                resolve([]);
            }
        });
    });
}

export function setPersons(persons: Person[]) {
    chrome.storage.local.set({persons: persons});
}

export async function deletePeronAt(index: number) {
    const persons = await getPersons();
    persons.splice(index, 1);
    await setPersons(persons);
}
