import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import { BasicShoe } from 'src/app/shared/intrefaces/basicShoe';

@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  constructor(private readonly apollo: Apollo) {}

  GET_ALL_MODELS = gql`
    query getAllShoes {
      basic_shoe {
        brand
        id
        model
        price
        rate
      }
    }
  `;

  logBasicShoeModels(): void {
    console.log('starting');
    this.apollo
      .watchQuery<{ shoes: BasicShoe[] }>({ query: this.GET_ALL_MODELS })
      .valueChanges.pipe(
        tap((result) => {
          const shoes = result.data.shoes;
          shoes.forEach((s) => console.log(s.model));
        }),
      ).subscribe();
  }
}
