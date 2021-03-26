import {Person} from "../common/Person";
import React from "react";
import {deletePeronAt, getPersons, setPersons} from "../common/PersonRepository";
import {addOnChangedListener, clearData, removeOnChangedListener} from "../util/storage";
import {isCurrentPageSupported, openTab, sendMessageToCurrentTab} from "./utils";
import {supportedPages} from "../util/supportedPages";
import {setupTestdata} from "../util/testdata";
import {UIMode, uiMode} from "../util/uiMode";

async function importData() {
    const newPersons: Person[] = JSON.parse(prompt("JSON") ?? "[]");
    const oldPersons = await getPersons();
    setPersons(oldPersons.concat(newPersons));
}

async function exportData() {
    alert(JSON.stringify(await getPersons()));
}

type PopupState = {
    persons: Array<Person>,
    pageSupported: boolean,
    deleteConfirmationIndex?: number,
}

export class Popup extends React.Component<{}, PopupState> {

    constructor(p: {}) {
        super(p);
        this.state = {
            persons: [],
            pageSupported: false,
            deleteConfirmationIndex: undefined
        }
    }

    async componentDidMount() {
        addOnChangedListener(this.reloadData);
        this.setState({
            pageSupported: await isCurrentPageSupported()
        });
        await this.reloadData();
    }

    componentWillUnmount() {
        removeOnChangedListener(this.reloadData);
    }

    reloadData = async () => {
        this.setState({
            persons: await getPersons(),
        });
    }

    async fillPerson(index: number) {
        await sendMessageToCurrentTab({type: "fill", personIndex: index});
    }

    async savePerson() {
        await sendMessageToCurrentTab({type: "save"});
    }

    showDeleteConfirmation(index: number) {
        this.setState({
            deleteConfirmationIndex: index
        });
    }

    async deletePermanently(index: number) {
        await deletePeronAt(index);
        this.hideDeleteConfirmation();
    }

    hideDeleteConfirmation() {
        this.setState({
            deleteConfirmationIndex: undefined
        });
    }

    renderDeleteConfirmation(currentIndex: number) {
        if (this.state.deleteConfirmationIndex === currentIndex) {
            return <div className="d-flex align-items-center mt-2">
                <div className="flex-fill">Endgültig löschen?</div>
                <div className="btn-group btn-group-sm" role="group">
                    <button type="button"
                            onClick={() => this.deletePermanently(currentIndex)}
                            className="btn btn-danger btn-sm">Ja
                    </button>
                    <button type="button"
                            onClick={() => this.hideDeleteConfirmation()}
                            className="btn btn-secondary btn-sm">Nein
                    </button>
                </div>
            </div>
        } else {
            return <></>
        }
    }

    render() {
        const bookmarkSection =
            <div className="list-group">
                {supportedPages.map((page) =>
                    <button onClick={() => openTab(page.url)} type="button"
                            className="list-group-item list-group-item-action list-group-item-default w-100">{page.name}</button>
                )}
            </div>;

        const developerArea = <>
            <h2 className="mt-3">Development</h2>
            <div className="list-group">
                <button onClick={setupTestdata} type="button" className="list-group-item list-group-item-action list-group-item-danger w-100">Testdaten laden
                </button>
                <button onClick={clearData} id="clearData" type="button" className="list-group-item list-group-item-action list-group-item-danger w-100">Daten löschen
                </button>
                <button onClick={importData} type="button" className="list-group-item list-group-item-action list-group-item-default w-100">Import
                </button>
                <button onClick={exportData} type="button" className="list-group-item list-group-item-action list-group-item-default w-100">Export
                </button>
            </div>
        </>

        let content;

        if (this.state.pageSupported) {
            content = <>
                <button onClick={this.savePerson} type="button" className="btn btn-success w-100 mt-3">Eingegebene Daten speichern</button>
                <h2 className="mt-3">Gespeicherte Personen</h2>
                <div className="list-group">
                    {this.state.persons.map((person, index) => (
                        <div className="list-group-item">
                            <div className="d-flex align-items-center">
                                <div className="flex-fill text-truncate pe-3">{person.firstName} {person.lastName}</div>
                                <div className="btn-group btn-group-sm" role="group">
                                    <button type="button" onClick={() => this.fillPerson(index)} className="btn btn-success">Ausfüllen</button>
                                    <button type="button" onClick={() => this.showDeleteConfirmation(index)} className="btn btn-danger">Löschen</button>
                                </div>
                            </div>
                            {this.renderDeleteConfirmation(index)}
                        </div>
                    ))}
                </div>
                {this.state.persons.length == 0 && <>
                    <p>Noch keine Daten gespeichert.</p>
                    <p>Zum Speichern einer Person zunächst das Anmeldeformular ausfüllen und vor dem Abschicken auf "Eingegebene Daten speichern" klicken.</p>
                </>}

                {uiMode === UIMode.Development && developerArea}

                <h2 className="mt-3">Anmeldeportal wechseln</h2>
                {bookmarkSection}
            </>;
        } else {
            content = <>
                <h2 className="mt-3">Anmeldung starten</h2>
                {bookmarkSection}
                <p className="mt-3"><b>Hinweis:</b> Derzeit unterstützt der Schnelltester Apotheken, die Bundesländer Niederösterreich, Salzburg, Tirol, Vorarlberg, Wien und die Burgenländischen Impf- und Testzentren (BITZ) <b>nicht</b>.</p>
            </>;
        }

        return <div className="p-3">
            <h1 className="text-center">🇦🇹 Schnelltester</h1>
            {content}
            <hr/>
            <p>Der Schnelltester ist ein privat entwickeltes und quelloffenes Projekt ohne Profitabsicht und steht in <b>keiner</b> Verbindung zu irgendeiner staatlichen, politischen oder gesundheitlichen Institution oder Organisation.</p>
            <p><b>Bitte keinesfalls bei Fragen, Problemen oder Verbesserungsvorschlägen, die den Schnelltester betreffen, die offiziellen Hotlines, Einrichtungen oder Behörden kontaktieren!</b></p>
            <p>Für Fragen, Probleme oder Verbesserungsvorschläge ist folgender Issue-Tracker vorgesehen: <a href="#" onClick={() => openTab("https://github.com/stefanschoeberl/schnelltester/issues")}>https://github.com/stefanschoeberl/schnelltester/issues</a></p>
            <hr/>
            <p className="text-center">
                <a href="#" onClick={() => openTab("/licenses.html")}>Lizenzen</a>
            </p>
        </div>;
    }
}
