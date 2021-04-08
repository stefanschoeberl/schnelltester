export type FillMessage = {
    type: "fill";
    personIndex: number;
}

export type MissingData = {
    educationPersonal?: boolean
}

export type SaveMessage = {
    type: "save";
    missingData?: MissingData
}

export type Message =
    | FillMessage
    | SaveMessage;
