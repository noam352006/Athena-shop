import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import { BasicShoe } from 'src/app/shared/intrefaces/basicShoe';
import { partialUser } from 'src/app/shared/intrefaces/partialUser';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';

@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  constructor(private readonly apollo: Apollo) {}

  //-----------------queries-----------------
  GET_ALL_BASIC_SHOES = gql`
    query getAllShoes {
      basic_shoe {
        brand
        id
        model
        price
        rating
      }
    }
  `;

  GET_ALL_ITEMS = gql`
    query getAllItems {
      shoe_item {
        id
        shoe {
          brand
          id
          imgUrl
          model
          price
          rating
        }
        date_created
        size
      }
    }
  `;

  GET_CONNECTED_USER = gql`
    query getUserByLogin($password: String!, $user_name: String!) {
      users_by_pk(password: $password, user_name: $user_name) {
        id
        user_name
        role
        date_created
      }
    }
  `;

  GET_USER_PURCHASES = gql`
    query getUserPurchasedBrands($id: uuid!) {
      purchases(where: { user_id: { _eq: $id } }) {
        shoe_item {
          id
          shoe {
            brand
            id
            imgUrl
            model
            price
            rating
          }
          date_created
          size
        }
      }
    }
  `;

  GET_PURCHASES = gql`
    query getUserPurchasedBrands {
      purchases {
        shoe_item {
          id
          shoe {
            brand
            id
            imgUrl
            model
            price
            rating
          }
          date_created
          size
        }
      }
    }
  `;

  logBasicShoeModels(): void {
    this.apollo
      .watchQuery<{ basic_shoe: BasicShoe[] }>({
        query: this.GET_ALL_BASIC_SHOES,
      })
      .valueChanges.pipe(
        tap((result) => {
          const shoes = result.data.basic_shoe;
          shoes.forEach((s) => console.log(s.model));
        }),
      )
      .subscribe();
  }

  getAllItems(): Observable<ShoeItem[]> {
    return this.apollo
      .watchQuery<{ shoe_item: ShoeItem[] }>({
        query: this.GET_ALL_ITEMS,
      })
      .valueChanges.pipe(map((result) => result.data.shoe_item));
  }

  getUserByInfo(
    userPassword: string,
    userName: string,
  ): Observable<partialUser> {
    return this.apollo
      .watchQuery<{ users: partialUser }>({
        query: this.GET_ALL_BASIC_SHOES,
        variables: { passwors: userPassword, user_name: userName },
      })
      .valueChanges.pipe(map((result) => result.data.users));
  }

  getUserPurchases(userId: string): Observable<ShoeItem[]> {
    return this.apollo
      .watchQuery<{ purchases: {shoe_item: ShoeItem[]} }>({
        query: this.GET_USER_PURCHASES,
      })
      .valueChanges.pipe(map((result) => result.data.purchases.shoe_item));
  }

    getAllPurchases(userId: string): Observable<ShoeItem[]> {
    return this.apollo
      .watchQuery<{ purchases: {shoe_item: ShoeItem[]} }>({
        query: this.GET_USER_PURCHASES,
      })
      .valueChanges.pipe(map((result) => result.data.purchases.shoe_item));
  }

  //---------------mutation--------------------

  SIGN_UP = gql`
    mutation getUserByLogin($password: String!, $user_name: String!) {
      insert_users_one(object: { password: $password, user_name: $user_name }) {
        id
        user_name
        date_created
      }
    }
  `;

  PURCHASE_ITEM = gql`
    mutation purchaseShoe($user_id: uuid!, $shoe_id: uuid!) {
      insert_purchases_one(object: { user_id: $user_id, item_id: $shoe_id }) {
        user_id
        item_id
        purchase_date
      }
    }
  `;

  signInUser(userPassword: string, userName: string): void {
    this.apollo
      .mutate({
        mutation: this.SIGN_UP,
        variables: { passwors: userPassword, user_name: userName },
      })
      .subscribe();
  }

  purchaseShoe(userId: string, itemID: string) {
    this.apollo
      .mutate({
        mutation: this.SIGN_UP,
        variables: { user_id: userId, shoe_id: itemID },
      })
      .subscribe();
  }
}
