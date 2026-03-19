import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, of } from 'rxjs';
import { BasicShoe } from 'src/app/shared/intrefaces/basicShoe';

@Injectable({
  providedIn: 'root',
})
export class BasicShoeQueries {
  constructor(private readonly apollo: Apollo) {}

  // ---------------- BASIC SHOES ----------------
  getAllBasicShoes(): Observable<BasicShoe[]> {
    return this.apollo
      .watchQuery<{ getAllBasicShoes: BasicShoe[] }>({
        query: gql`
          query {
            getAllBasicShoes {
              id
              brand
              model
              price
              rating
              imgUrl
            }
          }
        `,
      })
      .valueChanges.pipe(map((result) => result.data.getAllBasicShoes));
  }
}