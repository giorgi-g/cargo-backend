import { ApiProperty } from "@nestjs/swagger";
import { Field, Float, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsDateString, IsOptional, IsString } from "class-validator";
import { UserStatus, Role } from "src/prisma-client";

@InputType()
export class GetUsersInput {
    @ApiProperty({
        type: "string",
        required: false,
    })
    @Field(() => String)
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
    })
    @Field(() => String, {
        nullable: true,
    })
    @IsOptional()
    @IsString()
    email?: string | null;

    @ApiProperty({
        type: "string",
        required: false,
    })
    @Field(() => String)
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
    })
    @Field(() => String, {
        nullable: true,
    })
    @IsOptional()
    @IsString()
    personalId?: string | null;

    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
    })
    @Field(() => String, {
        nullable: true,
    })
    @IsOptional()
    @IsString()
    passportNumber?: string | null;

    @ApiProperty({
        enum: UserStatus,
        required: false,
        isArray: true,
    })
    @Field(() => [UserStatus], {
        defaultValue: [],
    })
    @IsOptional()
    statuses?: UserStatus[];

    @ApiProperty({
        enum: Role,
        required: false,
        isArray: true,
    })
    @Field(() => [Role], { nullable: false })
    roles?: Role[] = [];

    @ApiProperty({
        type: "string",
        required: false,
    })
    @Field(() => String)
    @IsOptional()
    @IsString()
    companyId?: string;
}
