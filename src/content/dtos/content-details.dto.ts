import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ContentDetailsDto {
    @Field(() => Float, { nullable: true })
    area?: number;

    @Field(() => Float, { nullable: true })
    weight?: number;

    @Field(() => Float, { nullable: true })
    volume?: number;

    @Field(() => Float, { nullable: true })
    width?: number;

    @Field(() => Float, { nullable: true })
    length?: number;

    @Field(() => Float, { nullable: true })
    height?: number;
}
