declare const UI_MODE: string;

export enum UIMode {
    Development,
    Production
}

let mode: UIMode | null;

switch (UI_MODE) {
    case "dev":
        mode = UIMode.Development;
        break;
    case "prod":
        mode = UIMode.Production;
        break;
    default:
        mode = null;
        break;
}

export const uiMode = mode;
