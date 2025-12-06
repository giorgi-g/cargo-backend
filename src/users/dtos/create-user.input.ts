import { Field, InputType } from "@nestjs/graphql";
import { CreateUserDto } from "@generated";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateUserInput extends CreateUserDto {
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
    })
    @IsString()
    // @IsNotEmpty()
    @Field(() => String, { nullable: true })
    backImageId: string | null;
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
    })
    @IsString()
    // @IsNotEmpty()
    @Field(() => String, { nullable: true })
    frontImageId: string | null;
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
    })
    @IsString()
    // @IsNotEmpty()
    @Field(() => String, { nullable: true })
    imageId: string | null;
}
