import { Injectable } from "@angular/core";
import { AuthState, AuthStore } from "./auth.store";
import { Query } from "@datorama/akita";
import { countBy, entries, flatMap, maxBy } from "lodash";
import { usersList } from "../../models/userList";
import { Brands } from "../../enums/brand.enum";
import { distinctUntilChanged, map, Observable, of, startWith, switchMap } from "rxjs";
import { User } from "../../intrefaces/user";
import { ShoeItem } from "../../intrefaces/shoeItem";
import { partialUser } from "../../intrefaces/partialUser";
import { ApolloService } from "src/app/services/apollo.service/apollo.service";

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<AuthState> {
  readonly favoriteBrand$: Observable<Brands>;

  get isLoggedIn(): boolean {
    return !!this.getValue().connectedUser;
  }

  get getCurrUser(): partialUser | undefined{
    return this.getValue().connectedUser;
  }

  getBestSeller(): string {
    const counts = countBy(flatMap(usersList, u => u.purchaseHistory.map(p => p.id)));
    const bestEntry = maxBy(entries(counts), ([, cnt]) => cnt) as [string, number] | undefined;

    if (!bestEntry) {
      return '';
    }

    const maxCount = bestEntry[1];
    const bestIds = entries(counts)
      .filter(([, cnt]) => cnt === maxCount)
      .map(([id]) => id);

    return bestIds[0];
  }

  constructor(protected override store: AuthStore, private apollo: ApolloService
  ) {
    super(store);

    this.favoriteBrand$ = this.select(state => state.connectedUser).pipe(
      switchMap(user => this.apollo.getUserPurchases(user?.id!) ?? of([] as ShoeItem[])),
      map(purchases => {
        const brand = maxBy(
          Object.entries(
            countBy(flatMap(purchases, s => s.shoe.brand))
          ),
          ([, cnt]) => cnt)?.[0] ?? 'Adidas';

        console.log(brand)
        return brand as Brands;
      }),
      startWith(Brands.Adidas),
      distinctUntilChanged()
    );
  }
}
