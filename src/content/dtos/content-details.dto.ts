import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ContentDetailsDto {
    @Field(() => String, { nullable: true })
    address: string;
    @Field(() => String, { nullable: true })
    checkInFrom: string;
    @Field(() => String, { nullable: true })
    checkOutUntil: string;
    @Field(() => String, { nullable: true })
    phoneNumber: string;
    @Field(() => String, { nullable: true })
    additionalPhoneNumber: string;
    @Field(() => String, { nullable: true })
    email: string;
    @Field(() => String, { nullable: true })
    propertyType: string;
    @Field(() => String, { nullable: true })
    cancellationPolicy: string;
    @Field(() => String, { nullable: true })
    ratePolicy: string;
    @Field(() => String, { nullable: true })
    mealPlan: string;
    @Field(() => String, { nullable: true })
    postalCode: string;
    @Field(() => Boolean, { nullable: true })
    childrenAllowed: boolean;
    @Field(() => Boolean, { nullable: true })
    petsAllowed: boolean;
    @Field(() => Boolean, { nullable: true })
    smokingAllowed: boolean;
}
