import { BasicShoe } from "./basicShoe";

export interface ShoeItem {
    id: string,
    shoe: BasicShoe,
    dateCreated: Date,
    size: number,
}