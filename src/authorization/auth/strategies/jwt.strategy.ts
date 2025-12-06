import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../constants/constants";
import { CurrentUserDto } from "../../../users/dtos/current-user.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });

        // console.log(">>> jwt check");
    }

    async validate(payload: any): Promise<CurrentUserDto> {
        return {
            email: payload.email,
            id: payload.sub,
            sub: payload.sub,
            firstName: payload.firstName,
            lastName: payload.lastName,
            middleName: payload.middleName,
            roleId: payload.roleId,
            companyId: payload.companyId,
            personalId: payload.personalId,
            passportNumber: payload.passportNumber,
            status: payload.status,
            birthday: payload.birthday,
            createdBy: payload.createdBy,
            updatedBy: payload.updatedBy,
            sid: payload.sid,
            permissions: payload.permissions,
            createdAt: payload.createdAt,
        };
    }
}
