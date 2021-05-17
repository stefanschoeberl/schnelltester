export type TestPage = {
    name: string;
    url: string;
    regex: RegExp;
};

export const supportedPages: TestPage[] = [
    {name: "Apotheken", url: "https://apotheken.oesterreich-testet.at", regex: /^https:\/\/apotheken\.oesterreich-testet\.at\/.*/},
    {name: "Burgenland Gemeinden", url: "https://burgenland.oesterreich-testet.at", regex: /^https:\/\/burgenland\.oesterreich-testet\.at\/.*/},
    {name: "Kärnten", url: "https://kaernten.oesterreich-testet.at", regex: /^https:\/\/kaernten\.oesterreich-testet\.at\/.*/},
    {name: "Oberösterreich", url: "https://ooe.oesterreich-testet.at", regex: /^https:\/\/ooe\.oesterreich-testet\.at\/.*/},
    {name: "Steiermark", url: "https://steiermark.oesterreich-testet.at", regex: /^https:\/\/steiermark\.oesterreich-testet\.at\/.*/},
];
