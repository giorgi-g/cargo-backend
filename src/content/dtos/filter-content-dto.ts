import {
    CargoType,
    ContentStatus,
    ContentType,
    HazardClass,
} from "../../prisma-client";
import { ApiProperty } from "@nestjs/swagger";
import { Field, InputType, Int } from "@nestjs/graphql";
import {
    IsBoolean,
    IsDateString,
    IsInt,
    IsNotEmpty,
    IsOptional,
} from "class-validator";

@InputType()
export class FilterContentDto {
    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    langId: number;

    @Field(() => ContentType, { nullable: false })
    @IsNotEmpty()
    contentType: ContentType;

    @ApiProperty({
        type: "string",
        nullable: true,
    })
    @IsOptional()
    @Field(() => String, { nullable: true })
    title?: string;

    @ApiProperty({
        type: "string",
        nullable: true,
    })
    @IsOptional()
    @Field(() => String, { nullable: true })
    slug?: string;

    @ApiProperty({
        enum: ContentStatus,
        nullable: true,
        isArray: true,
    })
    @Field(() => [ContentStatus], { nullable: true })
    @IsOptional()
    statuses?: ContentStatus[];

    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
        isArray: true,
    })
    @Field(() => [String], {
        nullable: true,
    })
    @IsOptional()
    pageIds?: string[];

    @ApiProperty({
        type: "string",
        format: "string",
        required: false,
        nullable: true,
    })
    @Field(() => String, {
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    startDate?: string | null;

    @ApiProperty({
        type: "string",
        format: "string",
        required: false,
        nullable: true,
    })
    @Field(() => String, {
        nullable: true,
    })
    @IsOptional()
    @IsDateString()
    endDate?: string | null;

    @ApiProperty({
        type: "integer",
        format: "int32",
        required: false,
        nullable: true,
    })
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    cityId?: number;

    @ApiProperty({
        enum: CargoType,
        nullable: true,
    })
    @Field(() => CargoType, { nullable: true })
    @IsOptional()
    cargoType?: CargoType;

    @ApiProperty({
        enum: HazardClass,
        nullable: true,
    })
    @Field(() => HazardClass, { nullable: true })
    @IsOptional()
    hazardClass?: HazardClass;

    @ApiProperty({
        type: "boolean",
        nullable: true,
    })
    @Field(() => Boolean, { nullable: true })
    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;
}
