import { CurrencyEntity } from "@generated";

export const currencies: CurrencyEntity[] = [
    {
        id: "USD",
        name: "United States Dollar",
        active: true,
        default: true,
        rate: 1,
        createdAt: new Date(),
        createdBy: "",
        updatedAt: new Date(),
        updatedBy: "",
    },
    {
        id: "EUR",
        name: "Euro",
        active: true,
        default: false,
        rate: 0.925,
        createdAt: new Date(),
        createdBy: "",
        updatedAt: new Date(),
        updatedBy: "",
    },
    {
        id: "GEL",
        name: "Georgian Lari",
        active: true,
        default: true,
        rate: 2.85,
        createdAt: new Date(),
        createdBy: "",
        updatedAt: new Date(),
        updatedBy: "",
    },
];

export default currencies;
