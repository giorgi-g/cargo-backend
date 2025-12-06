import { Field, InputType, Int } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";

@InputType()
export class FileEntityInput {
    @ApiProperty({
        type: "string",
        required: true,
    })
    @Field(() => String)
    id!: string;
}
