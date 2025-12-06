export class CurrentUserDto {
    email: string;
    id: string;
    sub: string;
    firstName: string;
    lastName: string;
    middleName: string;
    roleId: string;
    personalId: string;
    passportNumber: string;
    companyId: string;
    status: string;
    birthday: Date;
    createdBy: string | undefined;
    updatedBy: string | undefined;
    sid: string;
    permissions: string[];
    createdAt: Date;
}
