import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ShoeItem } from '../../intrefaces/shoeItem';
import { ShoeItemState, ShoeItemStore } from './shoe-item.store';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { FilterState } from '../../intrefaces/filterState';
import { BasicShoe } from '../../intrefaces/basicShoe';
import { countBy, maxBy } from 'lodash';
import { ItemQueries } from 'src/app/services/apollo.service/queries/item.queries';
import { BasicShoeQueries } from 'src/app/services/apollo.service/queries/basicShoe.query';

@Injectable({ providedIn: 'root' })
export class ShoeItemQuery extends QueryEntity<ShoeItemState> {
  constructor(
    protected override store: ShoeItemStore,
    private readonly itemQueries: ItemQueries,
    private readonly basicShoeQueries: BasicShoeQueries
  ) {
    super(store);
  }

  //------STATE FILTERES-------

  filters$: Observable<FilterState> = this.select(
    (state) => state.stateFilters,
  );

  filteredShoes$: Observable<ShoeItem[]> = combineLatest([
    this.selectAll(),
    this.filters$,
  ]).pipe(
    map(([shoes, activeFilters]) => {
      const filteredShoeItems  = this.applyAllFilters(shoes, activeFilters);

      return this.selectByBrand(filteredShoeItems , activeFilters.brands);
    }),
  );

  applyAllFilters(shoes: ShoeItem[], f: FilterState): ShoeItem[] {
    return shoes.filter((currShoe) => {
      if (f.size !== undefined && currShoe.size !== f.size) {
        return false;
      }

      if (
        currShoe.shoe.price < f.minPrice ||
        currShoe.shoe.price > f.maxPrice
      ) {
        return false;
      }

      return true;
    });
  }

  //---------SHOE-ITEMS LIST---------------

  getNewestItem(): Observable<ShoeItem | null> {
    return this.selectAll().pipe(
      filter((shoes) => shoes.length > 0), // מוודאים שיש לפחות ערך אחד
      map((shoes) => {
        const sorted = [...shoes].sort(
          (a, b) =>
            new Date(b.dateCreated).getTime() -
            new Date(a.dateCreated).getTime(),
        );
        return { ...sorted[0] }; // מחזירים את הכי חדשה
      }),
    );
  }

  getAllShoeItems(): ShoeItem[]{
    return this.getAll()
  }

  getBestSeller(): Observable<string> {
    return this.itemQueries.subscribeToPurhases().pipe(
      map((purchases) => {
        const counts = countBy(purchases, (p) => p.shoe.id);
        const best = maxBy(Object.entries(counts), ([, c]) => c);
        return best?.[0] ?? this.getAll()[0].id;
      }),
    );
  }

  selectByBrand(shoeList: ShoeItem[], brands?: string[]): ShoeItem[] {
    return brands?.length
      ? shoeList.filter((item) =>
          item.shoe.brand.some((v) => brands.includes(v)),
        )
      : shoeList;
  }

  getBasicShoeById(id: string): Observable<BasicShoe | undefined> {
    return this.basicShoeQueries
      .getAllBasicShoes()
      .pipe(map((shoes) => shoes.find((shoe) => shoe.id === id)));
  }

  selectItemsByBasicShoe(id: string): ShoeItem[] {
    return this.getAll().filter((item) => item.shoe.id === id);
  }

  getShoeSizes(shoId: string): number[] {
    return this.selectItemsByBasicShoe(shoId).map((s) => s.size);
  }

  isItemSoldOut(id: string): Observable<ShoeItem | undefined> {
    return this.itemQueries
      .subscribeToPurhases()
      .pipe(map((shoes) => shoes?.find((shoe) => shoe.id === id)));
  }
}
