import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, map, Observable, switchMap, tap } from 'rxjs';
import { Brands } from 'src/app/shared/enums/brand.enum';
import { BasicShoe } from 'src/app/shared/intrefaces/basicShoe';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';
import { AuthQuery } from 'src/app/shared/states/auth/auth.query';
import { AuthService } from 'src/app/shared/states/auth/auth.service';
import { ShoeItemQuery } from 'src/app/shared/states/shoeItems/shoe-item.query';
import { shoeItemService } from 'src/app/shared/states/shoeItems/shoe-item.service';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(
    private shoeQuery: ShoeItemQuery,
    private router: Router,
    private authQuery: AuthQuery,
    private shoeService: shoeItemService,
    private authService: AuthService,
  ) {}

  navToShop(): void {
    this.router.navigate(['/shop']);
  }

  getShoes(): ShoeItem[] {
    return this.shoeQuery.getAllShoes();
  }

  getNewestShoe(): Observable<ShoeItem | null> {
    return this.shoeQuery.selectNewest();
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

  sshoe: BasicShoe = {
    id: '0',
    brand: [Brands.Adidas, Brands.Yeezy],
    model: '350 BELUGA',
    rating: 3,
    price: 55,
    imgUrl: '../../../assets/items/adidas_yeezy_350_beluga.png',
  };

  shoe: ShoeItem = {
    id: '1',
    shoe: this.sshoe,
    dateCreated: new Date(),
    datePurchased: undefined,
    size: 7.5,
  };

  getMostBought(): Observable<BasicShoe | undefined> {
    return this.shoeQuery.getBestSeller().pipe(
      switchMap((id) => {
        return this.shoeQuery.getbasicShoeById(id);
      }),
    );
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
