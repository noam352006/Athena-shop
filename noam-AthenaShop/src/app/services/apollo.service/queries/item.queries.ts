import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, of } from 'rxjs';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';

@Injectable({
  providedIn: 'root',
})
export class ItemQueries {
  constructor(private readonly apollo: Apollo) {}

  //-----------------QUERIES---------------------------------
  
    getAllItems(): Observable<ShoeItem[]> {
      return this.apollo
        .query<{ getAllShoes: ShoeItem[] }>({
          query: gql`
            query {
              getAllShoes {
                id
                size
                dateCreated
                datePurchased
                shoe {
                  id
                  brand
                  model
                  price
                  rating
                  imgUrl
                }
              }
            }
          `,
          fetchPolicy: 'network-only',
        })
        .pipe(map((result) => result.data.getAllShoes));
    }
  
    ///replaced by subscribeToPurchases 
    getAllPurchases(): Observable<ShoeItem[]> {
      return this.apollo
        .watchQuery<{ getAllPurchases: ShoeItem[] }>({
          query: gql`
            query {
              getAllPurchases {
                id
                size
                dateCreated
                datePurchased
                shoe {
                  id
                  brand
                  model
                  price
                  rating
                  imgUrl
                }
              }
            }
          `,
        })
        .valueChanges.pipe(map((result) => result.data.getAllPurchases));
    }

    //---------------------SUBSCRIPTION----------------------------
  
    subscribeToPurhases(): Observable<ShoeItem[] | undefined> {
      return this.apollo
        .subscribe<{
          purchases: { purchaseDate: Date; shoe_item: ShoeItem }[] | undefined;
        }>({
          query: gql`
            subscription subscribeToPurchases {
              purchases {
                purchase_date
                shoe_item {
                  id
                  size
                  dateCreated
                  shoe {
                    brand
                    id
                    imgUrl
                    model
                    price
                    rating
                  }
                }
              }
            }
          `,
        })
        .pipe(
          map((result) =>
            result.data!.purchases?.flatMap((p) => {
              const item = p.shoe_item;
  
              const newItem: ShoeItem = {
                id: item.id,
                size: item.size,
                dateCreated: new Date(item.dateCreated),
                shoe: item.shoe,
                datePurchased: p.purchaseDate
                  ? new Date(p.purchaseDate)
                  : undefined,
              };
  
              return newItem;
            }),
          ),
        );
    }

    //------------------MUTATIONS-----------------------
  
    insertPurchase(userId: string, itemId: string): Observable<Date> {
      console.log('adding purchase', itemId, userId);
      return this.apollo
        .mutate<{ purchaseItem: Date }>({
          mutation: gql`
            mutation ($userId: String!, $itemId: String!) {
              purchaseItem(userId: $userId, itemId: $itemId)
            }
          `,
          variables: { userId, itemId },
        })
        .pipe(map((result) => result.data!.purchaseItem));
    }
}