import { Injectable } from "@angular/core";
import { ShoeItemStore } from "./shoe-item.store";
import { FilterState } from "../../intrefaces/filterState";
import { ApolloService } from "src/app/services/apollo.service/apollo.service";

@Injectable({ providedIn: 'root' })
export class shoeItemService {
    constructor(private store: ShoeItemStore, private apollo: ApolloService) { }

    moment = require('moment')

    updateFilter(chosenFilter: Partial<FilterState>): void {
        this.store.update(state => ({
            stateFilters: {
                ...state.stateFilters,
                ...chosenFilter
            }
        }));
    }
}

