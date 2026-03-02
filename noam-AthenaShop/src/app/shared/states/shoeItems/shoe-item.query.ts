import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { ShoeItem } from "../../intrefaces/shoeItem";
import { ShoeItemState, ShoeItemStore } from "./shoe-item.store";
import { combineLatest, map, Observable } from "rxjs";
import { FilterState } from "../../intrefaces/filterState";

@Injectable({ providedIn: 'root' })
export class ShoeItemQuery extends QueryEntity<ShoeItemState> {

    constructor(protected override store: ShoeItemStore) {
        super(store);
    }

    filters$: Observable<FilterState> = this.select(state => state.stateFilters);

    filteredShoes$: Observable<ShoeItem[]> = combineLatest([
        this.selectAll(),
        this.filters$,
    ]).pipe(map(([shoes, f]) => {
        const l = this.applyAllFilters(shoes, f)

        return this.selectByBrand(l, f.brands)
    }));


    getAllShoes(): ShoeItem[] {
        return this.getAll();
    }

    selectNewest(): Observable<ShoeItem> {
        return this.selectAll().pipe(
            map(shoes => {
                const sorted = [...shoes].sort((a, b) => {
                    return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
                });

                return { ...sorted[0] };
            })
        );
    };

    selectByBrand(shoeList: ShoeItem[], brands?: string[]): ShoeItem[] {
        return brands ? shoeList.filter(item => item.shoe.brand.some(v => brands.includes(v))) : shoeList;
    }

    selectByBasicShoe( id: string): ShoeItem[] {
        return this.getAllShoes().filter(item => item.shoe.id === id);
    }

    getShoeById(id: string): ShoeItem | undefined {
        return this.getAll().find((currShoe) => currShoe.shoe.id === id)
    }

    selectAllShoes(): Observable<ShoeItem[]> {
        return this.selectAll();
    }

    applyAllFilters(shoes: ShoeItem[], f: FilterState): ShoeItem[] {
        return shoes.filter(currShoe => {
            if (f.size !== undefined && currShoe.size !== f.size) {
                return false;
            }

            if (currShoe.shoe.price < f.minPrice || currShoe.shoe.price > f.maxPrice) {
                return false;
            }

            return true;
        });
    }

    getShoeSizes(shoId: string): number[] {
        return this.selectByBasicShoe(shoId).map(s => s.size)
    }
}