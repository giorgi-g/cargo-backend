import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    MembershipPlanEntity,
    CreateMembershipPlanDto,
    UpdateMembershipPlanDto,
} from "@generated";
import { subscriptions } from "../commands/seeds";

@Injectable()
export class MembershipService implements OnModuleDestroy {
    constructor(private readonly prisma: PrismaService) {}

    onModuleDestroy() {
        this.prisma.$disconnect();
    }

    async create(
        data: CreateMembershipPlanDto,
        userId: string,
    ): Promise<MembershipPlanEntity> {
        return this.prisma.membershipPlan.create({
            data: {
                ...data,
                createdBy: userId,
                updatedBy: userId,
            },
        });
    }

    async findAll(): Promise<MembershipPlanEntity[]> {
        return this.prisma.membershipPlan.findMany({
            where: {
                active: true,
            },
        });
    }

    async findOne(id: string): Promise<MembershipPlanEntity | null> {
        return this.prisma.membershipPlan.findFirst({
            where: { id, active: true },
        });
    }

    async update(
        id: string,
        data: UpdateMembershipPlanDto,
    ): Promise<MembershipPlanEntity> {
        return this.prisma.membershipPlan.update({
            where: { id, active: true },
            data: {
                ...data,
            },
        });
    }

    async seed(userId: string): Promise<MembershipPlanEntity[]> {
        try {
            console.log(">>> seeding memberships table");
            await this.prisma.membershipPlan.createMany({
                data: [
                    ...subscriptions.map((x) => ({
                        ...x,
                        createdBy: userId,
                        updatedBy: userId,
                    })),
                ],
                skipDuplicates: true,
            });

            console.log(">>> seeding memberships done!");
            return this.prisma.membershipPlan.findMany();
        } catch (e) {
            console.log(">>> membership plans already exist");
            return [];
        }
    }
}
