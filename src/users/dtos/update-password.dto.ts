import { Field, InputType } from "@nestjs/graphql";
import { IsString, Length, Matches } from "class-validator";
import { Match } from "../decorators/match.decorator";

@InputType()
export class UpdatePasswordDto {
    @Field({ nullable: false })
    @IsString()
    @Length(8, 32)
    @Match("password", { message: "Passwords do not match!" })
    repeatPassword: string;

    @IsString()
    @Field({ nullable: false })
    @Length(8, 32)
    @Matches(/^(?=.*[^\w\s])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            "Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter,  one symbol and one number.",
    })
    password: string;
}
