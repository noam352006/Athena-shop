import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, tap } from 'rxjs';
import { BasicShoe } from 'src/app/shared/intrefaces/basicShoe';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';
import { User } from 'src/app/shared/intrefaces/user';

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
        rate
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
          rate
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

  GET_USER_PURCHASED_BRANDS = gql`
    query getUserPurchasedBrands($id: uuid!) {
      purchases(where: { user_id: { _eq: $id } }) {
        shoe_item {
          shoe {
            brand
          }
        }
      }
    }
  `; 

  logBasicShoeModels(): void {
    console.log('starting');
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

  getAllItems(userPassword: string, userName: string): Observable<ShoeItem[]> {
    console.log('starting');
    return this.apollo
      .watchQuery<{ shoe_item: ShoeItem[] }>({
        query: this.GET_ALL_BASIC_SHOES,
      })
      .valueChanges.pipe(map((result) => result.data.shoe_item));
  }

  getUserByInfo(
    userPassword: string,
    userName: string,
  ): Observable<Partial<User>> {
    console.log('starting');
    return this.apollo
      .watchQuery<{ users: Partial<User> }>({
        query: this.GET_ALL_BASIC_SHOES,
        variables: { passwors: userPassword, user_name: userName },
      })
      .valueChanges.pipe(map((result) => result.data.users));
  }

  getUserPurchases() {}

  //---------------mutation--------------------

  SIGN_UP = gql`
  mutation getUserByLogin($password: String!, $user_name: String!) {
  insert_users_one(object:{ password: $password, user_name: $user_name}) {
    id
    user_name
    date_created
  }
}
`;

PURCHASE_ITEM = gql`
mutation purchaseShoe($user_id: uuid!, $shoe_id: uuid!){
  insert_purchases_one(object:{user_id: $user_id, item_id: $shoe_id}){
    user_id
    item_id
    purchase_date
  }
}`;

  signInUser(userPassword: string, userName: string):void  {
    this.apollo.mutate({
      mutation: this.SIGN_UP, 
      variables: { passwors: userPassword, user_name: userName },
    }).subscribe();
  }

  purchaseShoe(userId: string, itemID: string){
      this.apollo.mutate({
      mutation: this.SIGN_UP, 
      variables: {user_id: userId, shoe_id: itemID },
    }).subscribe();
  }
}
