import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, of } from 'rxjs';
import { BasicShoe } from 'src/app/shared/intrefaces/basicShoe';
import { partialUser } from 'src/app/shared/intrefaces/partialUser';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';

@Injectable({
  providedIn: 'root',
})
export class ApolloService {
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

  // ---------------- SHOE ITEMS ----------------

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

  subscribeToPurchases(): Observable<ShoeItem[] | undefined> {
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

  // ---------------- USERS ----------------
  getUserBycredentials(
    userPassword: string,
    userName: string,
  ): Observable<partialUser | null> {
    return this.apollo
      .watchQuery<{ getUserByCredentials: partialUser | null }>({
        query: gql`
          query ($userPassword: String!, $userName: String!) {
            getUserByCredentials(
              userPassword: $userPassword
              userName: $userName
            ) {
              id
              userName
              role
              dateCreated
            }
          }
        `,
        variables: { userPassword, userName },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map((result) => result.data.getUserByCredentials));
  }

  getUserByName(userName: string): Observable<partialUser | null> {
    return this.apollo
      .watchQuery<{ getUserByName: partialUser | null }>({
        query: gql`
          query ($userName: String!) {
            getUserByName(userName: $userName) {
              id
              userName
              role
              dateCreated
            }
          }
        `,
        variables: { userName },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map((result) => result.data.getUserByName));
  }

  getUserPurchasedBrands(userId: string): Observable<string[]> {
    if (!userId) return of([]);
    return this.apollo
      .watchQuery<{ getUserPurchasedBrands: string[] }>({
        query: gql`
          query ($userId: String!) {
            getUserPurchasedBrands(user_id: $userId)
          }
        `,
        variables: { userId },
      })
      .valueChanges.pipe(map((result) => result.data.getUserPurchasedBrands));
  }

  insertUser(userPassword: string, userName: string): Observable<partialUser> {
    return this.apollo
      .mutate<{ signUserUp: partialUser }>({
        mutation: gql`
          mutation ($userPassword: String!, $userName: String!) {
            signUserUp(userPassword: $userPassword, userName: $userName) {
              id
              userName
              role
              dateCreated
            }
          }
        `,
        variables: { userPassword, userName },
      })
      .pipe(map((result) => result.data!.signUserUp));
  }
}
