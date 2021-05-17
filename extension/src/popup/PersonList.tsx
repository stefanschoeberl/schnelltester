import React from "react";
import {Person} from "../common/Person";

type PersonEntryProps = {
    person: Person;
    index: number;
    showDeleteConfirmation: boolean;
    onFill: () => void;
    onPromptDelete: () => void;
    onAbortDelete: () => void;
    onDelete: () => void;
};

class PersonEntry extends React.Component<PersonEntryProps, {}> {

    renderDeleteConfirmation() {
            return <div className="d-flex align-items-center mt-2">
                <div className="flex-fill">Endgültig löschen?</div>
                <div className="btn-group btn-group-sm" role="group">
                    <button type="button"
                            onClick={() => this.props.onDelete()}
                            className="btn btn-danger btn-sm">Ja
                    </button>
                    <button type="button"
                            onClick={() => this.props.onAbortDelete()}
                            className="btn btn-secondary btn-sm">Nein
                    </button>
                </div>
            </div>;
    }

    render() {
        return <div className="list-group-item">
            <div className="d-flex align-items-center">
                <div
                    className="flex-fill text-truncate pe-3">{this.props.person.firstName} {this.props.person.lastName}</div>
                <div className="btn-group btn-group-sm" role="group">
                    <button type="button" onClick={() => this.props.onFill()}
                            className="btn btn-success">Ausfüllen
                    </button>
                    <button type="button" onClick={() => this.props.onPromptDelete()}
                            className="btn btn-danger">Löschen
                    </button>
                </div>
            </div>
            {this.props.showDeleteConfirmation && this.renderDeleteConfirmation()}
        </div>;
    }
}

type PersonListProps = {
    persons: Person[];
    onFill: (personIndex: number) => void;
    onDelete: (personIndex: number) => void;
};

type PersonListState = {
    deleteConfirmationIndex?: number;
};

export class PersonList extends React.Component<PersonListProps, PersonListState> {

    constructor(props: PersonListProps, context: any) {
        super(props, context);
        this.state = {
            deleteConfirmationIndex: undefined,
        };
    }

    deletePerson(personIndex: number) {
        this.props.onDelete(personIndex);
        this.hideDeleteConfirmation();
    }

    hideDeleteConfirmation() {
        this.setState({
            deleteConfirmationIndex: undefined,
        });
    }

    showDeleteConfirmation(index: number) {
        this.setState({
            deleteConfirmationIndex: index,
        });
    }

    render() {
        return <div className="list-group">
            {this.props.persons.map((person, index) => (
                <PersonEntry key={`${person.firstName}-${person.lastName}-${index}`}
                             person={person} index={index}
                             showDeleteConfirmation={this.state.deleteConfirmationIndex === index}
                             onFill={() => this.props.onFill(index)}
                             onPromptDelete={() => this.showDeleteConfirmation(index)}
                             onAbortDelete={() => this.hideDeleteConfirmation()}
                             onDelete={() => this.deletePerson(index)}
                />
            ))}
        </div>;
    }
}
