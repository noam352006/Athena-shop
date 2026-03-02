import { Injectable } from "@angular/core";
import { ShoeItemStore } from "./shoe-item.store";
import { FilterState } from "../../intrefaces/filterState";

@Injectable({ providedIn: 'root' })
export class shoeItemService {
    constructor(private store: ShoeItemStore) { }

    moment = require('moment')

    updateFilter(chosenFilter: Partial<FilterState>): void {
        this.store.update(state => ({
            stateFilters: {
                ...state.stateFilters,
                ...chosenFilter
            }
        }));
    }

    purchaseShoe(shoeId: string): void {
        this.store.update(
            entity => entity.id === shoeId,
            { datePurchased: this.moment('') }
        );
    }
}

