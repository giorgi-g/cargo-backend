import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DashboardInfoDto {
    @Field(() => Int)
    drivers: number;

    @Field(() => Int)
    logisticManagers: number;

    @Field(() => Int)
    destinations: number;

    @Field(() => Int)
    goods: number;

    @Field(() => Int)
    transfers: number;

    @Field(() => Int)
    services: number;

    @Field(() => Int)
    files: number;
}
