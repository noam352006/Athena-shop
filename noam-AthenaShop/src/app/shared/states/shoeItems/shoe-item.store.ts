import { Injectable } from '@angular/core';
import { EntityStore, EntityState, StoreConfig } from '@datorama/akita';
import { ShoeItem } from '../../intrefaces/shoeItem';
import { FilterState } from '../../intrefaces/filterState';
import { ItemQueries } from 'src/app/services/apollo.service/queries/item.queries';

export interface ShoeItemState extends EntityState<ShoeItem, number> {
  stateFilters: FilterState;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'shoeList', idKey: 'id' })
export class ShoeItemStore extends EntityStore<ShoeItemState, ShoeItem> {
  constructor(private itemQueries: ItemQueries) {
    super({
      stateFilters: {
        size: undefined,
        minPrice: 0,
        maxPrice: 200,
        brands: undefined,
      },
    });

    this.loadItems();
  }

  loadItems(): void {
    this.itemQueries.getAllItems().subscribe((items) => {
      this.add(items);
    });
  }
}
