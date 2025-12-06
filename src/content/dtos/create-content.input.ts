import { CreateContentDto } from "@generated";
import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsObject } from "class-validator";
import { ContentDetailsInput } from "./content-details.input";

@InputType()
export class CreateContentInput extends CreateContentDto {
    @Field(() => [String])
    @IsArray()
    amenities: string[];

    @Field(() => ContentDetailsInput)
    @IsObject()
    details: ContentDetailsInput;
}
