import {
    BadRequestException,
    Injectable,
    NotFoundException,
    OnModuleDestroy,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    CompanyEntity,
    CreateCompanyDto,
    RoleEnum,
    UpdateCompanyDto,
} from "@generated";
import { CurrentUserDto } from "../users/dtos";

@Injectable()
export class CompanyService implements OnModuleDestroy {
    constructor(private readonly prisma: PrismaService) {}

    onModuleDestroy() {
        this.prisma.$disconnect();
    }

    async create(
        data: CreateCompanyDto,
        user: CurrentUserDto,
    ): Promise<CompanyEntity> {
        const company = await this.findByName(data.name);

        if (company) {
            throw new BadRequestException({
                field: "name",
                message: "Company already exists!",
            });
        }

        return this.prisma.company.create({
            data: {
                ...data,
                createdBy: user.id,
                updatedBy: user.id,
            },
        });
    }

    async findAll() {
        return this.prisma.company.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    async findByName(name: string): Promise<CompanyEntity | null> {
        return await this.prisma.company.findFirst({
            where: { name },
        });
    }

    async findOne(id: string): Promise<CompanyEntity> {
        const company = await this.prisma.company.findUnique({ where: { id } });

        if (!company)
            throw new NotFoundException(`Company with ID ${id} not found`);

        return company;
    }

    async update(id: string, data: UpdateCompanyDto, user: CurrentUserDto) {
        if (user.roleId !== RoleEnum.ROOT) {
            this.compareCompanyIds(id, user.companyId);
        }

        await this.findOne(id);
        return this.prisma.company.update({
            where: { id },
            data: {
                ...data,
                updatedBy: user.id,
            },
        });
    }

    async delete(id: string, companyId: string) {
        this.compareCompanyIds(id, companyId);

        await this.findOne(id);
        return this.prisma.company.delete({ where: { id } });
    }

    private compareCompanyIds(id: string, companyId: string) {
        if (id !== companyId) {
            throw new BadRequestException([
                {
                    field: "companyId",
                    value: "invalid_company_id",
                },
            ]);
        }
    }
}
