import { CreateMembershipPlanDto } from "@generated";
import { BillingInterval, MembershipType } from "src/prisma-client";

export const subscriptions: CreateMembershipPlanDto[] = [
    {
        name: "Free",
        code: MembershipType.FREE,
        interval: BillingInterval.MONTHLY,
        price: 0,
        active: true,
        discount: 0,
        features: { seats: 1, storageGB: 1, support: "community" },
    },
    {
        name: "Starter",
        code: MembershipType.STARTER,
        interval: BillingInterval.MONTHLY,
        price: 59,
        active: true,
        discount: 59,
        features: {
            seats: 3,
            storageGB: 10,
            support: "email",
            analytics: true,
        },
    },
    {
        name: "Starter (Annual)",
        code: MembershipType.STARTER,
        interval: BillingInterval.ANNUAL,
        price: 708,
        active: true,
        discount: 599,
        features: {
            seats: 3,
            storageGB: 10,
            support: "email",
            analytics: true,
        },
    },

    // PLUS
    {
        name: "Plus",
        code: MembershipType.PLUS,
        interval: BillingInterval.MONTHLY,
        price: 99,
        active: true,
        discount: 99,
        features: {
            seats: 10,
            storageGB: 100,
            support: "priority",
            sso: false,
        },
    },
    {
        name: "Plus (Annual)",
        code: MembershipType.PLUS,
        interval: BillingInterval.ANNUAL,
        price: 1188,
        active: true,
        discount: 999,
        features: {
            seats: 10,
            storageGB: 100,
            support: "priority",
            sso: false,
        },
    },

    // PRO
    {
        name: "Pro",
        code: MembershipType.PRO,
        interval: BillingInterval.MONTHLY,
        price: 256,
        active: false,
        discount: 256,
        features: { seats: 25, storageGB: 500, support: "priority", sso: true },
    },
    {
        name: "Pro (Annual)",
        code: MembershipType.PRO,
        interval: BillingInterval.ANNUAL,
        price: 3072, // 99 * 12
        active: false,
        discount: 2560, // ~3 months free
        features: { seats: 25, storageGB: 500, support: "priority", sso: true },
    },
];
