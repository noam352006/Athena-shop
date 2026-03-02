import { Brands } from "../enums/brand.enum";

export interface BasicShoe {
    id: string,
    brand: Brands[],
    model: string,
    rating: number,
    price: number,
    imgUrl: string,
}