import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class FilterCountryDto {
    @Field(() => Int)
    @IsNotEmpty()
    @IsInt()
    langId: number;
}
