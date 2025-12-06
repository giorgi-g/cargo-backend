import { InputType } from "@nestjs/graphql";
import { CreateLicenseInput } from "./create-license.input";

@InputType()
export class UpdateLicenseInput extends CreateLicenseInput {}
