import { BasicShoe } from "./basicShoe";

export interface ShoeItem {
    id: string,
    shoe: BasicShoe,
    dateCreated: Date,
    datePurchased?: Date,
    size: number,
}