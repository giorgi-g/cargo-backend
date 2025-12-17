import { UpdateContentDto } from "@generated";
import { Field, InputType } from "@nestjs/graphql";
import { IsObject, IsOptional } from "class-validator";
import { ContentDetailsInput } from "./content-details.input";

@InputType()
export class UpdateContentInput extends UpdateContentDto {
    @Field(() => ContentDetailsInput, { nullable: true })
    @IsOptional()
    @IsObject()
    details?: ContentDetailsInput;
}
