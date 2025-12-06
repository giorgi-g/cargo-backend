import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString, Length } from "class-validator";
import { UserStatusEnum } from "../../../users/enums/user-status.enum";

@InputType()
export class SignUpDto {
    @IsEmail()
    @Field()
    email: string;

    @Field({ nullable: false })
    @IsString()
    @Length(2)
    firstName: string;

    @Field({ nullable: false })
    @IsString()
    @Length(2)
    lastName: string;

    @Field(() => UserStatusEnum, {
        nullable: true,
        defaultValue: UserStatusEnum.ACTIVE,
    })
    status?: UserStatusEnum = UserStatusEnum.ACTIVE;
}
