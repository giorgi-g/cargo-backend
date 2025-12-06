import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../users/user.service";
import { AuthDto } from "./auth.dto";
import { UserEntity } from "@generated";
import { v4 } from "uuid";
import { CurrentUserDto } from "../users/dtos/current-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (user == null) {
            return null;
        }

        if (user && user.password === pass) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async logIn(user: UserEntity): Promise<AuthDto> {
        const payload: CurrentUserDto = {
            email: user.email,
            sub: user.id,
            id: user.id,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            roleId: user.role,
            personalId: user.personalId,
            passportNumber: user.passportNumber,
            status: user.status,
            birthday: user.birthday,
            companyId: user.companyId,
            createdBy: user.createdBy,
            updatedBy: user.updatedBy,
            sid: v4(),
            permissions: [],
            createdAt: new Date(),
        };

        return {
            token: this.jwtService.sign(payload),
        };
    }
}
