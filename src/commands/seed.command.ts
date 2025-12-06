import { Command, CommandRunner } from "nest-commander";
import { PrismaService } from "../prisma/prisma.service";
import { BusinessTypeEnum, RoleEnum, UserStatusEnum } from "@generated";
import { genSaltSync, hashSync } from "bcrypt";
import { CountryService } from "../country/country.service";
import { UserService } from "../users/user.service";
import { CompanyService } from "../company/company.service";
import { LanguageService } from "../language/language.service";
import { CurrencyService } from "../currency/currency.service";
import { MembershipService } from "../membership/membership.service";

@Command({
    name: "db:seed",
    description: "Seed the database with initial data",
})
export class SeedCommand extends CommandRunner {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly countryService: CountryService,
        private readonly userService: UserService,
        private readonly companyService: CompanyService,
        private readonly languageService: LanguageService,
        private readonly currencyService: CurrencyService,
        private readonly membershipService: MembershipService,
    ) {
        super();
    }

    async run(): Promise<void> {
        console.log("Starting database seeding...");
        await this.languageService.seed();
        await this.countryService.seed();

        console.log(">>> seeding users table");
        const email: string = "ggumburashvili@gmail.com";
        const name: string = "Rubicon";
        const countryCode: string = "ge";
        const country = await this.countryService.findByCode(countryCode);

        let company = await this.companyService.findByName(name);
        if (!company) {
            console.log(">>> seeding company table");
            company = await this.prismaService.company.create({
                data: {
                    name,
                    email: "admin@rubicon.ge",
                    phone: "+995557526674",
                    address: "E.Mindeli 13a",
                    companyType: BusinessTypeEnum.LIMITED_LIABILITY_COMPANY,
                    countryId: country.id,
                },
            });
            console.log(">>> seeding company done!");
        }

        let user = await this.userService.findByEmail(email);
        if (!user && company?.id != null) {
            user = await this.prismaService.user.create({
                data: {
                    firstName: "Giorgi",
                    middleName: "",
                    lastName: "Gumburashvili",
                    email,
                    personalId: "35001128863",
                    passportNumber: "A012345",
                    status: UserStatusEnum.ACTIVE as UserStatusEnum,
                    role: RoleEnum.ROOT,
                    birthday: new Date("1995-07-15").toISOString(),
                    password: hashSync("Gio123@#$", genSaltSync(10)),
                    companyId: company.id,
                    createdBy: "_",
                    updatedBy: "_",
                },
            });

            await this.prismaService.user.update({
                where: { id: user.id },
                data: {
                    createdBy: user.id,
                    updatedBy: user.id,
                },
            });
            console.log(">>> seeding user done!");
        }

        await this.currencyService.seed(user.id);
        await this.membershipService.seed(user.id);
    }
}
