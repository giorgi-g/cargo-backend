import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { RoleEnum, UserEntity, UserStatusEnum } from "@generated";
import {
    UpdatePasswordDto,
    CurrentUserDto,
    UpdateUserInput,
    CreateUserInput,
} from "./dtos";
import { GetUsersInput } from "./dtos";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    private hashPassword(password: string): string {
        return hashSync(password, genSaltSync(10));
    }

    async create(
        data: CreateUserInput,
        requester: CurrentUserDto,
    ): Promise<UserEntity | null> {
        const user = await this.findByEmail(data.email);

        if (user) {
            throw new BadRequestException([
                {
                    field: "email",
                    value: "already_exists",
                },
            ]);
        }

        if (data.backImageId == "") delete data.backImageId;
        if (data.frontImageId == "") delete data.frontImageId;
        if (data.imageId == "") delete data.imageId;

        return this.prisma.user.create({
            data: {
                ...data,
                status: data.status as UserStatusEnum,
                birthday: new Date(data.birthday),
                password: this.hashPassword(data.password),
                createdBy: requester.id,
                updatedBy: "",
            },
        });
    }

    async findByEmailAndPassword(
        email: string,
        password: string,
    ): Promise<UserEntity | undefined> {
        const user: UserEntity = await this.prisma.user.findFirst({
            where: { email, status: UserStatusEnum.ACTIVE },
            include: { company: true },
        });

        if (user == null) {
            throw new BadRequestException({
                field: "email",
                message: "The user does not exist!",
            });
        }

        const comparePasswords = await this.comparePasswords(
            password,
            user.password,
        );

        if (comparePasswords !== true) {
            throw new BadRequestException({
                field: "password",
                message: "The password is invalid!",
            });
        }

        user.password = "";
        return user;
    }

    async findByEmail(email: string): Promise<UserEntity | undefined> {
        const user: UserEntity = await this.prisma.user.findFirst({
            where: { email },
            include: { company: true },
        });

        if (user) {
            user.password = "";
        }

        return user;
    }

    private async comparePasswords(
        password: string,
        hash: string,
    ): Promise<boolean> {
        return compareSync(password, hash);
    }

    checkPassword(data: UpdatePasswordDto) {
        if (data.password == null && data.repeatPassword == null) {
            throw new BadRequestException({
                field: "password",
                message: "Password must not be empty!",
            });
        }

        if (data.password !== data.repeatPassword) {
            throw new BadRequestException({
                field: "repeatPassword",
                message: "Passwords do not match!",
            });
        }
    }

    async findAll({
        companyId,
        roles,
        statuses,
    }: GetUsersInput): Promise<UserEntity[]> {
        const where: any = {
            companyId,
        };

        if (roles?.length) {
            where.role = {
                in: roles,
            };
        }

        if (statuses?.length) {
            where.status = {
                in: statuses,
            };
        }

        const users = await this.prisma.user.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
        });

        return users.map((x) => ({ ...x, password: "" }));
    }

    async findOne(id: string, companyId: string): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({
            where: { id, companyId },
            include: {
                company: true,
                frontImage: true,
                backImage: true,
                image: true,
            },
        });

        if (user) {
            user.password = "";
        }

        return user;
    }

    async update(
        id: string,
        data: UpdateUserInput,
        requester: CurrentUserDto,
    ): Promise<UserEntity> {
        if (data.backImageId == "") delete data.backImageId;
        if (data.frontImageId == "") delete data.frontImageId;
        if (data.imageId == "") delete data.imageId;

        return this.prisma.user.update({
            where: { id, companyId: data.companyId },
            data: {
                ...data,
                updatedBy: requester.id,
            },
        });
    }

    async delete(id: string, companyId: string) {
        await this.prisma.user.delete({ where: { id, companyId } });

        return true;
    }

    async count(companyId: string, role: RoleEnum): Promise<number> {
        return this.prisma.user.count({ where: { role, companyId } });
    }
}

// import { BadRequestException, Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import * as bcrypt from "bcryptjs";
// import { DeleteResult } from "typeorm";
// import { RolesService } from "../authorization/roles/roles.service";
// import { CreateUserDto } from "./dtos/create-user.dto";
// import { UpdatePasswordDto } from "./dtos/update-password.dto";
// import { UpdateUserDto } from "./dtos/update-user.dto";
// import { UserRequestInput } from "./dtos/user-request.input";
// import { UserDto } from "./dtos/user.dto";
// import { User } from "./entities/user.entity";
// import { UserStatusEnum } from "./enums/user-status.enum";
// import { UserRepository } from "./user.repository";
//
// @Injectable()
// export class UserService {
//     constructor(
//         @InjectRepository(User) private usersRepository: UserRepository,
//         private roleService: RolesService,
//     ) {}
//
//     async findUsers(request: UserRequestInput) {
//         const queryBuilder = this.usersRepository.createQueryBuilder("u");
//
//         if (request.status != null) {
//             queryBuilder
//                 .andWhere("u.status = :status")
//                 .setParameter("status", request.status);
//         }
//
//         if (request.roleId != null) {
//             queryBuilder
//                 .andWhere("u.roleId = :roleId")
//                 .setParameter("roleId", request.roleId);
//         }
//
//         queryBuilder.orderBy("u.createdAt", "DESC");
//
//         return queryBuilder.getMany();
//     }
//
//     async findAll(): Promise<UserDto[]> {
//         return this.usersRepository.find();
//     }
//
//     async findOne(id: string): Promise<User> {
//         return this.usersRepository.findOneBy({ id });
//     }
//
//
//     async delete(id: string): Promise<DeleteResult> {
//         return this.usersRepository.delete(id);
//     }
//
//     async createUser(userDto: CreateUserDto): Promise<UserDto> {
//         const currentUser = await this.findUserByEmail(userDto.email);
//
//         if (currentUser != null) {
//             throw new BadRequestException({
//                 field: "email",
//                 message: `The user with the email: ${userDto.email} already exists`,
//             });
//         }
//
//         userDto.password = await this.hashPassword(userDto.password);
//
//         const newUser: User = new User();
//         newUser.email = userDto.email;
//         newUser.firstName = userDto.firstName;
//         newUser.lastName = userDto.lastName;
//         newUser.password = userDto.password;
//         newUser.roleId = userDto.roleId;
//         newUser.createdAt = new Date();
//         newUser.updatedAt = new Date();
//
//         newUser.status = userDto.status
//             ? userDto.status
//             : UserStatusEnum.ACTIVE;
//
//         newUser.role = await this.roleService.findOne(userDto.roleId);
//
//         await this.usersRepository.insert(newUser);
//
//         return newUser;
//     }
//
//     async updateUser(
//         userDto: UpdateUserDto,
//         userId: string,
//     ): Promise<UserDto | undefined> {
//         const currentUser = await this.findOne(userId);
//
//         if (currentUser == null) {
//             throw new BadRequestException({
//                 field: "email",
//                 message: "This user is not exist",
//             });
//         }
//
//         const role = await this.roleService.findOne(userDto.roleId);
//         if (role == null) {
//             throw new BadRequestException({
//                 field: "roleId",
//                 message: `The role ${userDto.roleId} does not exist!`,
//             });
//         }
//
//         currentUser.firstName = userDto.firstName;
//         currentUser.lastName = userDto.lastName;
//         currentUser.roleId = userDto.roleId;
//
//         if (userDto.status != null) {
//             currentUser.status = userDto.status;
//         }
//
//         await this.usersRepository.update(currentUser.id, currentUser);
//
//         return currentUser;
//     }
//
//     async updatePassword(
//         userDto: UpdatePasswordDto,
//         userId: string,
//     ): Promise<UserDto | undefined> {
//         const currentUser = await this.findOne(userId);
//
//         this.checkPassword(userDto);
//
//         if (currentUser == null) {
//             throw new BadRequestException({
//                 field: "userId",
//                 message: `The user with the userId: ${userId} does not exists`,
//             });
//         }
//
//         currentUser.password = await this.hashPassword(userDto.password);
//
//         await this.usersRepository.update(currentUser.id, currentUser);
//
//         return currentUser;
//     }
//
//     async deleteUser(userId: string): Promise<boolean> {
//         const currentUser = await this.findOne(userId);
//
//         if (currentUser == null) {
//             throw new BadRequestException({
//                 field: "userId",
//                 message: `The user with the userId: ${userId} does not exists`,
//             });
//         }
//
//         currentUser.status = UserStatusEnum.DELETED;
//
//         await this.usersRepository.update(currentUser.id, currentUser);
//
//         return true;
//     }
// }
