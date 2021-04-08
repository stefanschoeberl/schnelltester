import {Person} from "../common/Person";
import React from "react";
import {deletePersonAt, getPersons} from "../common/PersonRepository";
import {addOnChangedListener, removeOnChangedListener} from "../util/storage";
import {getCurrentPageInfo, openTab, sendMessageToCurrentTab} from "./utils";
import {supportedPages, TestPage} from "../util/supportedPages";
import {UIMode, uiMode} from "../util/uiMode";
import {DevelopmentArea} from "./DevelopmentArea";
import {PersonList} from "./PersonList";
import {MissingData} from "../common/Message";
import {SaveArea} from "./SaveArea";

async function fillPerson(index: number) {
    await sendMessageToCurrentTab({type: "fill", personIndex: index});
}

async function savePerson(missingData?: MissingData) {
    await sendMessageToCurrentTab({type: "save", missingData: missingData});
}

export class Popup extends React.Component<{}, {
    persons: Array<Person>,
    pageInfo?: TestPage,
}> {

    constructor(p: {}) {
        super(p);
        this.state = {
            persons: [],
            pageInfo: undefined,
        }
    }

    async componentDidMount() {
        addOnChangedListener(this.reloadData);
        this.setState({
            pageInfo: await getCurrentPageInfo()
        });
        await this.reloadData();
    }

    componentWillUnmount() {
        removeOnChangedListener(this.reloadData);
    }

    isPageSupported() {
        return this.state.pageInfo !== undefined;
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
        if (this.isPageSupported()) {
            return <>
                <SaveArea
                    promptForEducationPersonal={this.state.pageInfo !== undefined && !this.state.pageInfo.withEducationPersonal}
                    onSave={savePerson}/>
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
                <p className="mt-3"><b>Hinweis:</b> Derzeit unterstützt der Schnelltester die Bundesländer Niederösterreich, Salzburg, Tirol, Vorarlberg, Wien und die Burgenländischen Impf- und Testzentren (BITZ) <b>nicht</b>.</p>
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
