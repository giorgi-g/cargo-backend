import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class HealthDto {
    @Field()
    message: string;

    @Field()
    status: number;
}
