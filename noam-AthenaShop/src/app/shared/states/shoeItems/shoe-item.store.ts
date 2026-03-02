import { Injectable } from "@angular/core";
import { EntityStore, EntityState, StoreConfig } from "@datorama/akita";
import { ShoeItem } from "../../intrefaces/shoeItem";
import { init } from "../../models/shoeItems";
import { FilterState } from "../../intrefaces/filterState";

export interface ShoeItemState extends EntityState<ShoeItem, number> {
    stateFilters: FilterState;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shoeList', idKey: 'id' })
export class ShoeItemStore extends EntityStore<ShoeItemState, ShoeItem> {
    constructor() {

        super({
            stateFilters: {
                size: undefined,
                minPrice: 0,
                maxPrice: 200,
                brands: undefined,
            }
        });

        this.add(init);
    }
}
