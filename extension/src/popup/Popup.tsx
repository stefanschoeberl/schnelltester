import {Person} from "../common/Person";
import React from "react";
import {deletePersonAt, getPersons} from "../common/PersonRepository";
import {addOnChangedListener, removeOnChangedListener} from "../util/storage";
import {isCurrentPageSupported, openTab, sendMessageToCurrentTab} from "./utils";
import {supportedPages} from "../util/supportedPages";
import {UIMode, uiMode} from "../util/uiMode";
import {DevelopmentArea} from "./DevelopmentArea";
import {PersonList} from "./PersonList";

async function fillPerson(index: number) {
    await sendMessageToCurrentTab({type: "fill", personIndex: index});
}

async function savePerson() {
    await sendMessageToCurrentTab({type: "save"});
}

export class Popup extends React.Component<{}, {
    persons: Array<Person>,
    pageSupported: boolean,
}> {

    constructor(p: {}) {
        super(p);
        this.state = {
            persons: [],
            pageSupported: false,
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

    renderBookmarkSection() {
        return <div className="list-group">
            {supportedPages.map((page) =>
                <button onClick={() => openTab(page.url)} type="button"
                        className="list-group-item list-group-item-action list-group-item-default w-100">{page.name}</button>
            )}
        </div>;
    }

    renderContent() {
        if (this.state.pageSupported) {
            return <>
                <button onClick={savePerson} type="button" className="btn btn-success w-100 mt-3">Eingegebene Daten speichern</button>
                <h2 className="mt-3">Gespeicherte Personen</h2>
                <PersonList persons={this.state.persons}
                            onFill={fillPerson}
                            onDelete={deletePersonAt}
                />
                {this.state.persons.length == 0 && <>
                    <p>Noch keine Daten gespeichert.</p>
                    <p>Zum Speichern einer Person zunächst das Anmeldeformular ausfüllen und vor dem Abschicken auf "Eingegebene Daten speichern" klicken.</p>
                </>}

                <h2 className="mt-3">Anmeldeportal wechseln</h2>
                {this.renderBookmarkSection()}
            </>;
        } else {
            return <>
                <h2 className="mt-3">Anmeldung starten</h2>
                {this.renderBookmarkSection()}
                <p className="mt-3"><b>Hinweis:</b> Derzeit unterstützt der Schnelltester Apotheken, die Bundesländer Niederösterreich, Salzburg, Tirol, Vorarlberg, Wien und die Burgenländischen Impf- und Testzentren (BITZ) <b>nicht</b>.</p>
            </>;
        }
    }

    renderSupportInfoSection() {
        return <>
            <p>Der Schnelltester ist ein privat entwickeltes und quelloffenes Projekt ohne Profitabsicht und steht in <b>keiner</b> Verbindung zu irgendeiner staatlichen, politischen oder gesundheitlichen Institution oder Organisation.</p>
            <p><b>Bitte keinesfalls bei Fragen, Problemen oder Verbesserungsvorschlägen, die den Schnelltester betreffen, die offiziellen Hotlines, Einrichtungen oder Behörden kontaktieren!</b></p>
            <p>Für Fragen, Probleme oder Verbesserungsvorschläge ist folgender Issue-Tracker vorgesehen: <a href="#" onClick={() => openTab("https://github.com/stefanschoeberl/schnelltester/issues")}>https://github.com/stefanschoeberl/schnelltester/issues</a></p>
        </>
    }

    render() {
        return <div className="p-3" style={{cursor: "default", userSelect: "none"}}>
            <h1 className="text-center position-relative">🇦🇹 Schnelltester
                {uiMode === UIMode.Development && <span className="badge bg-info position-absolute top-0 end-0">DEV</span>}
            </h1>
            {this.renderContent()}
            <hr/>
            {this.renderSupportInfoSection()}
            <hr/>
            <p className="text-center">
                <a href="#" onClick={() => openTab("/licenses.html")}>Lizenzen</a>
            </p>
            {uiMode === UIMode.Development && <DevelopmentArea/>}
        </div>;
    }
}
