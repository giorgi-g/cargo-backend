import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    CreateLanguageDto,
    LanguageEntity,
    UpdateLanguageDto,
} from "@generated";
import { languages } from "../commands/seeds";

@Injectable()
export class LanguageService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateLanguageDto): Promise<LanguageEntity> {
        return this.prisma.language.create({
            data: {
                ...data,
            },
        });
    }

    async findAll(): Promise<LanguageEntity[]> {
        return this.prisma.language.findMany({
            where: { active: true },
        });
    }

    async findOne(id: number): Promise<LanguageEntity | null> {
        return this.prisma.language.findFirst({
            where: { id },
        });
    }

    async findDefaultLanguage(): Promise<LanguageEntity | null> {
        return this.prisma.language.findFirst({
            where: { default: true },
        });
    }

    async update(id: number, data: UpdateLanguageDto): Promise<LanguageEntity> {
        return this.prisma.language.update({
            where: { id },
            data,
        });
    }

    async remove(id: number): Promise<LanguageEntity> {
        return this.prisma.language.delete({
            where: { id },
        });
    }

    async seed(): Promise<LanguageEntity[]> {
        try {
            console.log(">>> seeding languages table");
            await this.prisma.language.createMany({
                data: languages,
                skipDuplicates: true,
            });

            console.log(">>> seeding languages done!");
            return this.prisma.language.findMany();
        } catch (e) {
            console.log(">>> languages already exist");
            return [];
        }
    }
}
