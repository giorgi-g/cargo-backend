import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CurrencyEntity, UpdateCurrencyDto } from "@generated";
import { CurrentUserDto } from "../users/dtos";
import { currencies } from "../commands/seeds";
import { CreateCurrencyInput } from "./dtos/create-currency.input";

@Injectable()
export class CurrencyService implements OnModuleDestroy {
    constructor(private readonly prisma: PrismaService) {}

    onModuleDestroy() {
        this.prisma.$disconnect();
    }

    async create(
        data: CreateCurrencyInput,
        user: CurrentUserDto,
    ): Promise<CurrencyEntity> {
        const defaultCurrency = await this.findDefaultCurrency();
        if (defaultCurrency != null) {
            await this.update(
                defaultCurrency.id,
                { ...defaultCurrency, default: false },
                user,
            );
        }

        return this.prisma.currency.create({
            data: {
                ...data,
                createdBy: user.id, // Associate the creator
                updatedBy: user.id, // Associate the updater
            },
        });
    }

    async findAll(user: CurrentUserDto): Promise<CurrencyEntity[]> {
        return this.prisma.currency.findMany({
            where: { createdBy: user.id }, // Fetch only currencies created by the current user
        });
    }

    async findOne(
        id: string,
        user: CurrentUserDto,
    ): Promise<CurrencyEntity | null> {
        return this.prisma.currency.findFirst({
            where: { id, createdBy: user.id }, // Fetch currency created by the current user
        });
    }

    async findDefaultCurrency(): Promise<CurrencyEntity | null> {
        return this.prisma.currency.findFirst({
            where: { default: true }, // Fetch currency created by the current user
        });
    }

    async update(
        id: string,
        data: CreateCurrencyInput,
        user: CurrentUserDto,
    ): Promise<CurrencyEntity> {
        const defaultCurrency = await this.findDefaultCurrency();
        if (defaultCurrency != null && id !== defaultCurrency.id) {
            await this.update(
                defaultCurrency.id,
                { ...defaultCurrency, default: false },
                user,
            );
        }

        return this.prisma.currency.update({
            where: { id },
            data: {
                ...data,
                updatedBy: user.id, // Associate the updater
            },
        });
    }

    async remove(id: string, user: CurrentUserDto): Promise<CurrencyEntity> {
        return this.prisma.currency.delete({
            where: { id },
        });
    }

    async seed(userId: string): Promise<boolean> {
        try {
            console.log(">>> seeding currencies table");
            await this.prisma.currency.createMany({
                data: [
                    ...currencies.map((x) => ({
                        ...x,
                        createdBy: userId,
                        updatedBy: userId,
                    })),
                ],
                skipDuplicates: true,
            });

            console.log(">>> seeding currencies done!");
            return true;
        } catch (e) {
            return false;
        }
    }
}
