import { Field, InputType } from "@nestjs/graphql";
import { CreateTransportDto } from "@generated";
import { ApiProperty } from "@nestjs/swagger";
import { FileEntityInput } from "../../file/types";
import { IsArray, IsNotEmpty } from "class-validator";

@InputType()
export class CreateTransportInput extends CreateTransportDto {
    @ApiProperty({
        type: FileEntityInput,
        isArray: true,
        required: true,
    })
    @IsArray()
    @IsNotEmpty()
    @Field(() => [FileEntityInput], { nullable: false, defaultValue: [] })
    fileIds: FileEntityInput[] = [];
}
