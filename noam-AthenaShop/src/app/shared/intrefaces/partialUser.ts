import { UserRole } from "../enums/userRole.enum";

export interface partialUser {
    id: string,
    userName: string,
    role: UserRole,
    dateCreated: Date,
}