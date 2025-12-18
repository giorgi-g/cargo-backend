import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CountryEntity, CreateCountryDto, UpdateCountryDto } from "@generated";
import { countries } from "../commands/seeds";

@Injectable()
export class CountryService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateCountryDto): Promise<CountryEntity> {
        return this.prisma.country.create({
            data,
        });
    }

    async findAll(): Promise<CountryEntity[]> {
        return this.prisma.country.findMany({
            where: {},
        });
    }

    async findOne(id: number): Promise<CountryEntity | null> {
        return this.prisma.country.findFirst({
            where: { id },
        });
    }

    async findByCode(code: string): Promise<CountryEntity | null> {
        return this.prisma.country.findFirst({
            where: { code: code.toUpperCase() },
        });
    }

    async update(id: number, data: UpdateCountryDto): Promise<CountryEntity> {
        return this.prisma.country.update({
            where: { id },
            data: {
                ...data,
            },
        });
    }

    async seed(): Promise<CountryEntity[]> {
        try {
            console.log(">>> seeding countries table");
            await this.prisma.country.createMany({
                data: [
                    ...countries.map((x) => ({
                        ...x,
                    })),
                ],
                skipDuplicates: true,
            });

            console.log(">>> seeding countries done!");
            return this.prisma.country.findMany();
        } catch (e) {
            console.log(">>> countries already exist", e);
            return [];
        }
    }
}
