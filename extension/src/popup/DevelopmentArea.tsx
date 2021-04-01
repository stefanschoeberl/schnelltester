import React from "react";
import {setupTestdata} from "../util/testdata";
import {clearData} from "../util/storage";
import {Person} from "../common/Person";
import {getPersons, setPersons} from "../common/PersonRepository";

async function importData() {
    const newPersons: Person[] = JSON.parse(prompt("JSON") ?? "[]");
    const oldPersons = await getPersons();
    setPersons(oldPersons.concat(newPersons));
}

async function exportData() {
    alert(JSON.stringify(await getPersons()));
}

export class DevelopmentArea extends React.Component<{}, {}> {
    render() {
        return <>
            <h2 className="mt-3">Development</h2>
            <div className="list-group">
                <button onClick={setupTestdata} type="button"
                        className="list-group-item list-group-item-action list-group-item-danger w-100">Testdaten laden
                </button>
                <button onClick={clearData} id="clearData" type="button"
                        className="list-group-item list-group-item-action list-group-item-danger w-100">Daten löschen
                </button>
                <button onClick={importData} type="button"
                        className="list-group-item list-group-item-action list-group-item-default w-100">Import
                </button>
                <button onClick={exportData} type="button"
                        className="list-group-item list-group-item-action list-group-item-default w-100">Export
                </button>
            </div>
        </>;
    }
}