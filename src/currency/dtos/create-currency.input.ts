import { CreateCurrencyDto } from "@generated";
import { Field, Float, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateCurrencyInput extends CreateCurrencyDto {
    @ApiProperty({
        type: "boolean",
    })
    @Field(() => Boolean)
    @IsNotEmpty()
    default: boolean;

    @ApiProperty({
        type: "boolean",
    })
    @Field(() => Boolean)
    @IsNotEmpty()
    active: boolean;

    @ApiProperty({
        type: "number",
    })
    @Field(() => Float)
    @IsNotEmpty()
    rate: number;
}
