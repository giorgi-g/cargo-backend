import { BusinessType, CompanyType } from "../../prisma-client";
import { ApiProperty } from "@nestjs/swagger";
import { Field, InputType, Int } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

@InputType()
export class FilterCompanyDto {
    @ApiProperty({
        enum: CompanyType,
        nullable: true,
    })
    @Field(() => CompanyType, { nullable: true })
    @IsOptional()
    companyType?: CompanyType;

    @ApiProperty({
        enum: BusinessType,
        nullable: true,
    })
    @Field(() => BusinessType, { nullable: true })
    @IsOptional()
    businessType?: BusinessType;

    @ApiProperty({
        type: "boolean",
        nullable: true,
    })
    @Field(() => Boolean, { nullable: true })
    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @ApiProperty({
        type: "integer",
        format: "int32",
        nullable: true,
    })
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    countryId?: number;

    @ApiProperty({
        type: "string",
        nullable: true,
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        type: "string",
        nullable: true,
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({
        type: "string",
        nullable: true,
        description: "Filter by parent company ID",
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    parentId?: string;
}