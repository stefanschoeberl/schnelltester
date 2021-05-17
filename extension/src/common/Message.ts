export type FillMessage = {
    type: "fill";
    personIndex: number;
};

export type SaveMessage = {
    type: "save";
};

export type Message =
    | FillMessage
    | SaveMessage;
