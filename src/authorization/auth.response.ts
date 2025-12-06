import { Field, ObjectType } from "@nestjs/graphql";
import { UserEntity } from "@generated";

@ObjectType()
export class AuthResponse {
    @Field()
    token: string;

    @Field(() => UserEntity, { nullable: false })
    user: UserEntity;
}
