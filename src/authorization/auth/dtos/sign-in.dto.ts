import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

@InputType()
export class SignInDto {
    @IsEmail()
    @Field()
    email: string;

    @Field()
    @IsString()
    password: string;
}
