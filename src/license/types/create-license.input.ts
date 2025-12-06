import { Field, InputType } from "@nestjs/graphql";
import { CreateLicenseDto } from "@generated";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class CreateLicenseInput extends CreateLicenseDto {
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
    })
    @IsString()
    @IsNotEmpty()
    @Field(() => String, { nullable: true })
    backImageId: string | null;
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
    })
    @IsString()
    @IsNotEmpty()
    @Field(() => String, { nullable: true })
    frontImageId: string | null;
    @ApiProperty({
        type: "string",
        required: false,
        nullable: true,
    })
    @IsString()
    @IsNotEmpty()
    @Field(() => String, { nullable: true })
    fileId: string | null;
}
