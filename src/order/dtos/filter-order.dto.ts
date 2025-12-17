import { OrderStatus, PaymentMethod } from "../../prisma-client";
import { ApiProperty } from "@nestjs/swagger";
import { Field, InputType, Int } from "@nestjs/graphql";
import {
    IsDateString,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from "class-validator";

@InputType()
export class FilterOrderDto {
    @ApiProperty({
        type: "integer",
        format: "int32",
        default: 1,
    })
    @Field(() => Int, { defaultValue: 1 })
    @IsInt()
    @Min(1)
    page: number;

    @ApiProperty({
        type: "integer",
        format: "int32",
        default: 10,
    })
    @Field(() => Int, { defaultValue: 10 })
    @IsInt()
    @Min(1)
    size: number;

    @ApiProperty({
        type: "string",
        nullable: true,
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiProperty({
        enum: OrderStatus,
        nullable: true,
    })
    @Field(() => OrderStatus, { nullable: true })
    @IsOptional()
    status?: OrderStatus;

    @ApiProperty({
        type: "string",
        nullable: true,
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    userId?: string;

    @ApiProperty({
        type: "string",
        nullable: true,
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    currencyId?: string;

    @ApiProperty({
        enum: PaymentMethod,
        nullable: true,
    })
    @Field(() => PaymentMethod, { nullable: true })
    @IsOptional()
    paymentMethod?: PaymentMethod;

    @ApiProperty({
        type: "string",
        format: "date-time",
        nullable: true,
        description: "Filter orders created on or after this date",
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({
        type: "string",
        format: "date-time",
        nullable: true,
        description: "Filter orders created on or before this date",
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiProperty({
        type: "string",
        nullable: true,
        description: "Search in order notes",
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    notes?: string;
}
