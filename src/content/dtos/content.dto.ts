import { Field, ObjectType, OmitType } from "@nestjs/graphql";
import { ContentEntity } from "@generated";
import { ContentDetailsDto } from "./content-details.dto";

@ObjectType()
export class ContentDto extends OmitType(ContentEntity, ["details"]) {
    @Field(() => ContentDetailsDto)
    details: ContentDetailsDto;
}
