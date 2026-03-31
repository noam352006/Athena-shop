import { Injectable } from '@angular/core';
import { ShoeItemStore } from './shoe-item.store';
import { FilterState } from '../../intrefaces/filterState';

@Injectable({ providedIn: 'root' })
export class shoeItemService {
  constructor(
    private store: ShoeItemStore,
  ) {}

  updateFilter(chosenFilter: Partial<FilterState>): void {
    this.store.update((state) => ({
      stateFilters: {
        ...state.stateFilters,
        ...chosenFilter,
      },
    }));
  }
}
