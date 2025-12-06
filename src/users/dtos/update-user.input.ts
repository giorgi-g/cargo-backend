import { Field, InputType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UpdateUserDto } from "@generated";

@InputType()
export class UpdateUserInput extends UpdateUserDto {
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
    })
    @IsString()
    @Field(() => String, { nullable: true })
    backImageId: string | null;
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
    })
    @IsString()
    @Field(() => String, { nullable: true })
    frontImageId: string | null;
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
    })
    @IsString()
    @Field(() => String, { nullable: true })
    imageId: string | null;
}
