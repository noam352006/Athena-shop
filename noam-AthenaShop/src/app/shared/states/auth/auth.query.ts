import { Injectable } from "@angular/core";
import { AuthState, AuthStore } from "./auth.store";
import { Query } from "@datorama/akita";
import { countBy, maxBy } from "lodash";
import { Brands } from "../../enums/brand.enum";
import { distinctUntilChanged, map, Observable, of, startWith, switchMap } from "rxjs";
import { ShoeItem } from "../../intrefaces/shoeItem";
import { partialUser } from "../../intrefaces/partialUser";
import { UserQueries } from "src/app/services/apollo.service/queries/user.queries";

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<AuthState> {
  readonly favoriteBrand$: Observable<Brands>;

  get isLoggedIn(): boolean {
    return !!this.getValue().connectedUser;
  }

  get getCurrUser(): partialUser | undefined {
    return this.getValue().connectedUser;
  }

  constructor(protected override store: AuthStore, private apollo: UserQueries
  ) {
    super(store);

    this.favoriteBrand$ = this.select(state => state.connectedUser).pipe(
      switchMap(user => this.apollo.getUserPurchasedBrands(user?.id!) ?? of([] as ShoeItem[])),
      map(purchasedBrands => {
        const brand = maxBy(
          Object.entries(
            countBy(purchasedBrands)
          ),
          ([, cnt]) => cnt)?.[0] ?? 'Adidas';

        return brand as Brands;
      }),
      startWith(Brands.Adidas),
      distinctUntilChanged()
    );
  }
}
