import { Field, InputType, Int } from "@nestjs/graphql";
import { IsOptional, IsNumber, IsString, IsBoolean, Min } from "class-validator";
import {
    TransportBrandsEnum,
    TransportModeEnum,
    VehicleTypeEnum,
    TransportColorEnum,
    SteeringWheelSideEnum,
    TransmissionTypeEnum,
    FuelTypeEnum,
} from "@generated";

@InputType()
export class FilterTransportDto {
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

    @Field(() => TransportBrandsEnum, { nullable: true })
    @IsOptional()
    brand?: TransportBrandsEnum;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    model?: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    yearFrom?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    yearTo?: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    licensePlate?: string;

    @Field(() => TransportModeEnum, { nullable: true })
    @IsOptional()
    type?: TransportModeEnum;

    @Field(() => VehicleTypeEnum, { nullable: true })
    @IsOptional()
    vehicleType?: VehicleTypeEnum;

    @Field(() => TransportColorEnum, { nullable: true })
    @IsOptional()
    color?: TransportColorEnum;

    @Field(() => SteeringWheelSideEnum, { nullable: true })
    @IsOptional()
    steeringWheelSide?: SteeringWheelSideEnum;

    @Field(() => TransmissionTypeEnum, { nullable: true })
    @IsOptional()
    transmission?: TransmissionTypeEnum;

    @Field(() => FuelTypeEnum, { nullable: true })
    @IsOptional()
    fuelType?: FuelTypeEnum;

    @Field(() => Boolean, { nullable: true })
    @IsOptional()
    @IsBoolean()
    isTurbo?: boolean;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    userId?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    notes?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    inspectionValidFrom?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    inspectionValidTo?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    insuranceValidFrom?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    insuranceValidTo?: string;
}
