import React from "react";
import {MissingData} from "../common/Message";

type SaveAreaProps = {
    onSave: (missingData?: MissingData) => void,
    promptForEducationPersonal: boolean
};

type PromptHidden = {
    type: "hidden";
}

type PromptVisible = {
    type: "visible";
    educationPersonal: boolean | undefined;
}

type SaveAreaState =
    | PromptHidden
    | PromptVisible;

export class SaveArea extends React.Component<SaveAreaProps, SaveAreaState> {

    constructor(p: SaveAreaProps) {
        super(p);
        this.state = {type: "hidden"};
    }

    initiateSave() {
        if (this.props.promptForEducationPersonal) {
            this.setState({type: "visible", educationPersonal: undefined});
        } else {
            this.props.onSave(undefined);
        }
    }

    completeSave() {
        if (this.state.type == "visible") {
            this.props.onSave({educationPersonal: this.state.educationPersonal});
            this.setState({type: "hidden"});
        }
    }

    render() {
        const saveButton = <button onClick={() => this.initiateSave()} type="button"
                                   className="btn btn-success w-100 mt-3"
                                   disabled={this.state.type === "visible"}>Eingegebene Daten speichern</button>;

        switch (this.state.type) {
            case "visible":
                return <>
                    {saveButton}
                    <p className="mt-3">Manche Anmeldeseiten (Burgenland Gemeinden, Oberösterreich und Steiermark) fragen nach zusätzlichen Informationen, die im aktuellen Anmeldeformular nicht erfasst werden. Nachfolgend können diese Informationen ergänzt werden, damit die gespeicherte Person auch auf anderen Anmeldeseiten verwendet werden kann.</p>
                    <p className="mt-3 mb-1">Gehören Sie zum Bildungspersonal in Österreich? <span className="text-danger">*</span></p>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio"
                               id="radioEducationPersonalYes"
                               checked={this.state.educationPersonal !== undefined && this.state.educationPersonal}
                               onChange={(e) => this.setState({type: "visible", educationPersonal: e.currentTarget.checked})}/>
                        <label className="form-check-label" htmlFor="radioEducationPersonalYes">Ja</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio"
                               id="radioEducationPersonalNo"
                               checked={this.state.educationPersonal !== undefined && !this.state.educationPersonal}
                               onChange={(e) => this.setState({type: "visible", educationPersonal: !e.currentTarget.checked})}/>
                        <label className="form-check-label" htmlFor="radioEducationPersonalNo">Nein</label>
                    </div>
                    <button onClick={() => this.completeSave()} type="button" className="btn btn-success w-100 mt-3" disabled={this.state.educationPersonal === undefined}>Speichern abschließen</button>
                </>
            case "hidden":
                return saveButton;
        }
    }
}
