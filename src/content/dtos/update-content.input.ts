import { UpdateContentDto } from "@generated";
import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsObject } from "class-validator";
import { ContentDetailsInput } from "./content-details.input";

@InputType()
export class UpdateContentInput extends UpdateContentDto {
    @Field(() => [String])
    @IsArray()
    amenities: string[];

    @Field(() => ContentDetailsInput)
    @IsObject()
    details: ContentDetailsInput;
}
