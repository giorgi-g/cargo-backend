import { Field, InputType, Int } from "@nestjs/graphql";
import { IsOptional, IsNumber, IsString, Min } from "class-validator";
import { DriverLicenseTypeEnum } from "@generated";

@InputType()
export class FilterLicenseDto {
    @Field(() => Int, { defaultValue: 1 })
    @IsNumber()
    @Min(1)
    page: number = 1;

    @Field(() => Int, { defaultValue: 10 })
    @IsNumber()
    @Min(1)
    size: number = 10;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    id?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    number?: string;

    @Field(() => DriverLicenseTypeEnum, { nullable: true })
    @IsOptional()
    type?: DriverLicenseTypeEnum;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    userId?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    validFrom?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    validTo?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    createdAtFrom?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    createdAtTo?: string;
}
