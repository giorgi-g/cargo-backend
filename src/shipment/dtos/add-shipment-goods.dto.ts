import { Field, InputType, Int, Float } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

@InputType()
export class AddShipmentGoodsDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    contentId: string;

    @Field(() => Int, { defaultValue: 1 })
    @IsNumber()
    @Min(1)
    quantity: number = 1;

    @Field(() => Float, { defaultValue: 0 })
    @IsNumber()
    @IsOptional()
    unitPrice?: number = 0;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    unitCurrency?: string;

    @Field(() => Float, { defaultValue: 0 })
    @IsNumber()
    @IsOptional()
    totalWeight?: number = 0;

    @Field(() => Float, { defaultValue: 0 })
    @IsNumber()
    @IsOptional()
    totalVolume?: number = 0;
}

@InputType()
export class UpdateShipmentGoodsDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    contentId: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(1)
    quantity?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    unitPrice?: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    unitCurrency?: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    totalWeight?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    totalVolume?: number;
}

@InputType()
export class RemoveShipmentGoodsDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    contentId: string;
}
