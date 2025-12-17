import { CreateContentDto } from "@generated";
import { Field, InputType } from "@nestjs/graphql";
import { IsObject, IsOptional } from "class-validator";
import { ContentDetailsInput } from "./content-details.input";

@InputType()
export class CreateContentInput extends CreateContentDto {
    @Field(() => ContentDetailsInput, { nullable: true })
    @IsOptional()
    @IsObject()
    details?: ContentDetailsInput;
}
