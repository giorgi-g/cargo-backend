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
import { FilterCompanyDto } from "./dtos";

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

    async findAll(
        user: CurrentUserDto,
        request?: FilterCompanyDto,
    ): Promise<CompanyEntity[]> {
        const where: any = {};

        // ROOT users can see all companies, others see only their own or public
        if (user.roleId !== RoleEnum.ROOT) {
            where.OR = [{ id: user.companyId }, { isPublic: true }];
        }

        if (request?.companyType != null) {
            where.companyType = request.companyType;
        }

        if (request?.businessType != null) {
            where.businessType = request.businessType;
        }

        if (request?.isPublic != null) {
            where.isPublic = request.isPublic;
        }

        if (request?.countryId != null && !isNaN(request?.countryId)) {
            where.countryId = request.countryId;
        }

        if (request?.name != null) {
            where.name = {
                contains: request.name,
                mode: "insensitive",
            };
        }

        if (request?.email != null) {
            where.email = {
                contains: request.email,
                mode: "insensitive",
            };
        }

        if (request?.parentId != null) {
            where.parentId = request.parentId;
        }

        return this.prisma.company.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                country: true,
                parent: true,
                children: true,
            },
        });
    }

    async findByName(name: string): Promise<CompanyEntity | null> {
        return await this.prisma.company.findFirst({
            where: { name },
        });
    }

    async findOne(id: string, user?: CurrentUserDto): Promise<CompanyEntity> {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                country: true,
                parent: true,
                children: true,
            },
        });

        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        // Non-ROOT users can only view their own company or public companies
        if (
            user &&
            user.roleId !== RoleEnum.ROOT &&
            company.id !== user.companyId &&
            !company.isPublic
        ) {
            throw new BadRequestException("Access denied to this company");
        }

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

    async delete(id: string, user: CurrentUserDto) {
        // Only ROOT can delete companies
        if (user.roleId !== RoleEnum.ROOT) {
            throw new BadRequestException("Only ROOT users can delete companies");
        }

        // Prevent deleting own company
        if (id === user.companyId) {
            throw new BadRequestException("Cannot delete your own company");
        }

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
