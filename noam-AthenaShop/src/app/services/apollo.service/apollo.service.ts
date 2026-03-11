import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { result } from 'lodash';
import { map, Observable, of, tap } from 'rxjs';
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
        imgUrl
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
    purchase{
      purchase_date
    }
    dateCreated
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
        dateCreated
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
          dateCreated
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
          dateCreated
          size
        }
      }
    }
  `;

  GET_USER_BY_NAME= gql`query getUserByName($user_name: String!){
  users(where: {user_name: {_eq: $user_name}}){
    user_name
  }
}`

  getAllBasicShoes(): Observable<BasicShoe[]> {
    return this.apollo
      .watchQuery<{ basic_shoe: BasicShoe[] }>({
        query: this.GET_ALL_BASIC_SHOES,
      })
      .valueChanges.pipe(map((result) => result.data.basic_shoe));
  }

  getAllItems(): Observable<ShoeItem[]> {
    return this.apollo
      .watchQuery<{ shoe_item: any[] }>({
        query: this.GET_ALL_ITEMS,
      })
      .valueChanges.pipe(map((result) => {
        const itemList = result.data.shoe_item;
        return itemList.map(item => {
          const mappedItem: ShoeItem = {
            id: item.id,
            datePurchased: item.purchase? item.purchase.purchase_date: undefined,
            dateCreated: item.dateCreated,
            size: item.size,
            shoe: item.shoe
          }
          return mappedItem
        })
      }));
  }

  getUserByInfo(
    userPassword: string,
    userName: string,
  ): Observable<partialUser | null> {
    console.log('fetching user password:', userPassword, 'user:', userName);

    return this.apollo
      .watchQuery<{ users_by_pk: any }>({
        query: this.GET_CONNECTED_USER,
        variables: {
          password: userPassword,
          user_name: userName,
        },
        fetchPolicy: 'network-only', // חשוב לדיבוג – מבטל cache
      })
      .valueChanges.pipe(
        map((result) => {
          const user = result?.data?.users_by_pk;
          if (!user) {
            console.log('User not found');
            return null;
          }
          const mappedUser: partialUser = {
            id: user.id,
            userName: user.user_name,
            role: user.role,
            dateCreated: user.dateCreated,
          };
          return mappedUser;
        }),
      );
  }

  getUserPurchases(userId: string): Observable<ShoeItem[]> {
    if (!userId) {
      return of([] as ShoeItem[]);
    } else {
      return this.apollo
        .watchQuery<{ purchases: { shoe_item: ShoeItem[] }[] }>({
          query: this.GET_USER_PURCHASES,
          variables: { id: userId },
        })
        .valueChanges.pipe(map((result) => result.data.purchases.flatMap(p => p.shoe_item) ?? []));
    }
  }

  getAllPurchases(): Observable<ShoeItem[]> {
    return this.apollo
      .watchQuery<{ purchases: { shoe_item: ShoeItem[] }[] }>({
        query: this.GET_PURCHASES,
      })
      .valueChanges.pipe(map((result) => result.data.purchases.flatMap(p => p.shoe_item) ?? []));
  }

  getUserByName(
    userName: string,
  ): Observable<string | null> {

    return this.apollo
      .watchQuery<{ users: {user_name : string}[] }>({
        query: this.GET_USER_BY_NAME,
        variables: {
          user_name: userName,
        },
        fetchPolicy: 'network-only', // חשוב לדיבוג – מבטל cache
      })
      .valueChanges.pipe(
        map((result) => {
          const user = result?.data?.users[0];
          if (!user) {
            console.log('userName does not exist');
            return null;
          }
          return user.user_name;
        }),
      );
    }

    
  //---------------mutation--------------------

  SIGN_UP = gql`
    mutation getUserByLogin($password: String!, $user_name: String!) {
      insert_users_one(object: { password: $password, user_name: $user_name }) {
        id
        user_name
        role
        dateCreated
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

  signInUser(
    userPassword: string,
    userName: string,
  ): Observable<partialUser | undefined> {
    return this.apollo
      .mutate<{ insert_users_one: any }>({
        mutation: this.SIGN_UP,
        variables: { password: userPassword, user_name: userName },
      })
      .pipe(
        map((r) => {
          const user = r?.data?.insert_users_one;
          if (user) {
            const mappedUser: partialUser = {
              id: user.id,
              userName: user.user_name,
              role: user.role,
              dateCreated: user.dateCreated,
            };

            return mappedUser;
          } else {
            return undefined
          }
        }),
      );
  }

  purchaseShoe(userId: string, itemID: string) {
    console.log("apollo-service, purchasing shoe :)")
    this.apollo
      .mutate({
        mutation: this.PURCHASE_ITEM,
        variables: { user_id: userId, shoe_id: itemID },
        refetchQueries:[this.GET_PURCHASES]
      })
      .subscribe();
  }
}
