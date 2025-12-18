import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

@InputType()
export class AddOrderShipmentDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    shipmentId: string;

    @Field(() => Int, { defaultValue: 0 })
    @IsNumber()
    @Min(0)
    @IsOptional()
    position?: number = 0;
}

@InputType()
export class UpdateOrderShipmentDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    shipmentId: string;

    @Field(() => Int)
    @IsNumber()
    @Min(0)
    position: number;
}

@InputType()
export class RemoveOrderShipmentDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    shipmentId: string;
}
