import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DashboardInfoDto {
    @Field(() => Int)
    drivers: number;

    @Field(() => Int)
    guides: number;

    @Field(() => Int)
    destinations: number;

    @Field(() => Int)
    tours: number;

    @Field(() => Int)
    transfers: number;

    @Field(() => Int)
    accommodations: number;

    @Field(() => Int)
    cafes: number;

    @Field(() => Int)
    files: number;
}
