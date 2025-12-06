import { Field, InputType } from "@nestjs/graphql";
import { UpdateTransportDto } from "@generated";
import { ApiProperty } from "@nestjs/swagger";
import { FileEntityInput } from "../../file/types";
import { IsArray, IsNotEmpty } from "class-validator";

@InputType()
export class UpdateTransportInput extends UpdateTransportDto {
    @ApiProperty({
        type: FileEntityInput,
        isArray: true,
    })
    @IsArray()
    @IsNotEmpty()
    @Field(() => [FileEntityInput], { nullable: false, defaultValue: [] })
    fileIds?: FileEntityInput[] = [];
}
