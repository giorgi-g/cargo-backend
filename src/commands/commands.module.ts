import { Module } from "@nestjs/common";
import { SeedCommand } from "./seed.command";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "../users/user.service";
import { CountryService } from "../country/country.service";
import { CompanyService } from "../company/company.service";
import { LanguageService } from "../language/language.service";
import { CurrencyService } from "../currency/currency.service";
import { MembershipService } from "../membership/membership.service";

@Module({
    providers: [
        SeedCommand,
        PrismaService,
        UserService,
        CountryService,
        CompanyService,
        LanguageService,
        CurrencyService,
        MembershipService,
    ],
    exports: [SeedCommand],
})
export class CommandsModule {}
