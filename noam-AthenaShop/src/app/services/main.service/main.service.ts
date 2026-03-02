import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { Brands } from 'src/app/shared/enums/brand.enum';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';
import { init } from 'src/app/shared/models/shoeItems';
import { AuthQuery } from 'src/app/shared/states/auth/auth.query';
import { AuthService } from 'src/app/shared/states/auth/auth.service';
import { ShoeItemQuery } from 'src/app/shared/states/shoeItems/shoe-item.query';
import { shoeItemService } from 'src/app/shared/states/shoeItems/shoe-item.service';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private shoeQuery: ShoeItemQuery,
    private router: Router,
    private authQuery: AuthQuery,
    private shoeService: shoeItemService,
    private authService: AuthService
  ) { }

  navToShop(): void {
    this.router.navigate(['/shop']);
  }

  getShoes(): ShoeItem[] {
    return this.shoeQuery.getAllShoes();
  }

  getNewestShoe(): Observable<ShoeItem> {
    return this.shoeQuery.selectNewest();
  }

  getBrandTopSuggestions(favBrand: string): Observable<ShoeItem[]> {
    return this.shoeQuery.selectAll().pipe(
      map(items => {
        return this.shoeQuery.selectByBrand(items, [favBrand])
          .sort((a, b) => b.shoe.rating - a.shoe.rating).slice(0, 4);
      })
    )
  }

  getTopSuggestionsForUser(): Observable<ShoeItem[]> {
    return this.authQuery.favoriteBrand$.pipe(
      switchMap(favBrand => {
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
          })
        );
      })
    );
  }

  getMostBought(): ShoeItem {
    return this.shoeQuery.getShoeById(this.authQuery.getBestSeller()) ?? init[0];
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

  purchaseItem(shoe: ShoeItem): boolean {
    if (shoe.datePurchased === undefined) {
      this.authService.purchase(shoe);
      this.shoeService.purchaseShoe(shoe.id);

      return true;
    } else {
      return false;
    }
  }

  getShoeSizes(id: string): number[] {
    return this.shoeQuery.getShoeSizes(id);
  }
}

