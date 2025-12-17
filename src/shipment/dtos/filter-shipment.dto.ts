import {
    PaymentMethod,
    ServiceType,
    ShipmentStatus,
    ShipmentType,
} from "../../prisma-client";
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
export class FilterShipmentDto {
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
        enum: ShipmentStatus,
        nullable: true,
    })
    @Field(() => ShipmentStatus, { nullable: true })
    @IsOptional()
    status?: ShipmentStatus;

    @ApiProperty({
        enum: ShipmentType,
        nullable: true,
    })
    @Field(() => ShipmentType, { nullable: true })
    @IsOptional()
    shipmentType?: ShipmentType;

    @ApiProperty({
        enum: ServiceType,
        nullable: true,
    })
    @Field(() => ServiceType, { nullable: true })
    @IsOptional()
    serviceType?: ServiceType;

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
    driverId?: string;

    @ApiProperty({
        type: "string",
        nullable: true,
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    departureId?: string;

    @ApiProperty({
        type: "string",
        nullable: true,
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    arrivalId?: string;

    @ApiProperty({
        type: "string",
        nullable: true,
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    customerId?: string;

    @ApiProperty({
        type: "string",
        nullable: true,
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    supplierId?: string;

    @ApiProperty({
        type: "string",
        nullable: true,
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    logisticsId?: string;

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
        description: "Filter shipments with start date on or after this date",
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsDateString()
    startDateFrom?: string;

    @ApiProperty({
        type: "string",
        format: "date-time",
        nullable: true,
        description: "Filter shipments with start date on or before this date",
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsDateString()
    startDateTo?: string;

    @ApiProperty({
        type: "string",
        format: "date-time",
        nullable: true,
        description: "Filter shipments created on or after this date",
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsDateString()
    createdAtFrom?: string;

    @ApiProperty({
        type: "string",
        format: "date-time",
        nullable: true,
        description: "Filter shipments created on or before this date",
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsDateString()
    createdAtTo?: string;

    @ApiProperty({
        type: "string",
        nullable: true,
        description: "Search in shipment notes",
    })
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    notes?: string;
}
