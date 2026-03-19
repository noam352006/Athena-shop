import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, firstValueFrom, map, Observable, switchMap } from 'rxjs';
import { Brands } from 'src/app/shared/enums/brand.enum';
import { BasicShoe } from 'src/app/shared/intrefaces/basicShoe';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';
import { AuthQuery } from 'src/app/shared/states/auth/auth.query';
import { ShoeItemQuery } from 'src/app/shared/states/shoeItems/shoe-item.query';
import { shoeItemService } from 'src/app/shared/states/shoeItems/shoe-item.service';
import { ItemQueries } from '../apollo.service/queries/item.queries';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(
    private shoeQuery: ShoeItemQuery,
    private router: Router,
    private authQuery: AuthQuery,
    private shoeService: shoeItemService,
    private itemQueries: ItemQueries
  ) {}

  navToShop(): void {
    this.router.navigate(['/shop']);
  }

  async getNewestShoe(): Promise<ShoeItem | undefined> {
    return await firstValueFrom(this.shoeQuery.getNewestItem());
  }

  getBrandTopSuggestions(favBrand: string): Observable<ShoeItem[]> {
    return this.shoeQuery.selectAll().pipe(
      map((items) => {
        return this.shoeQuery
          .selectByBrand(items, [favBrand])
          .sort((a, b) => b.shoe.rating - a.shoe.rating)
          .slice(0, 4);
      }),
    );
  }

  getTopSuggestionsForUser(): Observable<ShoeItem[]> {
    return this.authQuery.favoriteBrand$.pipe(
      switchMap((favBrand) => {
        const favShoes$ = this.getBrandTopSuggestions(favBrand);
        const adidasShoes$ = this.getBrandTopSuggestions('Adidas' as Brands);

        return combineLatest([favShoes$, adidasShoes$]).pipe(
          map(([favShoes, adidasShoes]) => {
            const result: ShoeItem[] = [];

            result.push(...favShoes.slice(0, 4));

            if (result.length < 4 && favBrand !== 'Adidas') {
              const need = 4 - result.length;
              result.push(...adidasShoes.slice(0, need));
            }

            return result;
          }),
        );
      }),
    );
  }

  async getBestSeller(): Promise<BasicShoe | undefined> {
    return await firstValueFrom( this.shoeQuery.getBestSeller().pipe(
      switchMap((id) => {
        return this.shoeQuery.getBasicShoeById(id);
      }),
    ));
  }

  close(filter: string): void {
    if (filter === 'size' || filter === 'all') {
      this.shoeService.updateFilter({ size: undefined });
    }
    if (filter === 'brands' || filter === 'all') {
      this.shoeService.updateFilter({ brands: undefined });
    }
    if (filter === 'price' || filter === 'all') {
      this.shoeService.updateFilter({ minPrice: 0, maxPrice: 200 });
    }
  }

  async didPurchaseItem(shoeId: string): Promise<boolean> {
    const userId = this.authQuery.getCurrUser?.id;
    if (userId) {
      return await this.itemQueries.insertPurchase(userId, shoeId)? true : false;
    } else {
      return false;
    }
  }

  getShoeSizes(id: string): number[] {
    return this.shoeQuery.getShoeSizes(id);
  }

  isItemSoldOut(id: string): Observable<ShoeItem | undefined> {
    return this.shoeQuery.isItemSoldOut(id);
  }
}
