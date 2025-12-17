import { Field, Float, InputType } from "@nestjs/graphql";
import { IsNumber, IsOptional } from "class-validator";

@InputType()
export class ContentDetailsInput {
    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    area?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    weight?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    volume?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    width?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    length?: number;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    height?: number;
}
