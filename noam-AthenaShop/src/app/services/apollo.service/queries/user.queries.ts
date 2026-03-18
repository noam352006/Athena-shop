import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable, of } from 'rxjs';
import { partialUser } from 'src/app/shared/intrefaces/partialUser';

@Injectable({
  providedIn: 'root',
})
export class UserQueries {
  constructor(private readonly apollo: Apollo) {}

  //-------------------------QUERIES-----------------------
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
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map((result) => result.data.getUserPurchasedBrands));
  }

  //-------------MUTATION-----------------------
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
