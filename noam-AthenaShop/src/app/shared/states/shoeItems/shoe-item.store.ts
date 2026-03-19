import { Injectable } from '@angular/core';
import { EntityStore, EntityState, StoreConfig } from '@datorama/akita';
import { ShoeItem } from '../../intrefaces/shoeItem';
import { FilterState } from '../../intrefaces/filterState';
import { ItemQueries } from 'src/app/services/apollo.service/queries/item.queries';

export interface ShoeItemState extends EntityState<ShoeItem, number> {
  stateFilters: FilterState;
}

export function createInitialState(): ShoeItemState {
  return {
    stateFilters: {
      size: undefined,
      minPrice: 0,
      maxPrice: 200,
      brands: undefined,
    },
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shoeList', idKey: 'id' })
export class ShoeItemStore extends EntityStore<ShoeItemState, ShoeItem> {
  constructor(private itemQueries: ItemQueries) {
    super(createInitialState());

    this.loadItems();
  }

  async loadItems(): Promise<void> {
    this.add(await this.itemQueries.getAllItems())
  }
}
