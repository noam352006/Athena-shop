import { UserRole } from "../enums/userRole.enum";
import { ShoeItem } from "./shoeItem";

export interface User {
    id: string,
    userName: string,
    password: string,
    role: UserRole,
    dateCreated: Date,
    purchaseHistory: ShoeItem[],
}