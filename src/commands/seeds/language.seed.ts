import { CreateLanguageDto } from "@generated";

export const languages: CreateLanguageDto[] = [
    {
        name: "English",
        abbr: "en",
        native: "English",
        locale: "en-GB",
        default: true,
        active: true,
    },
    {
        name: "Georgian",
        abbr: "ge",
        native: "ქართული",
        locale: "ka-GE",
        default: false,
        active: true,
    },
    {
        name: "French",
        abbr: "fr",
        native: "Français",
        locale: "fr-FR",
        default: false,
        active: true,
    },
];

export default languages;
