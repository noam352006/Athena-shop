import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { partialUser } from 'src/app/shared/intrefaces/partialUser';
import { signUserUpMutation } from '../mutations';
import {
  getUserByCredentialsQuery,
  getUserByNameQuery,
  getUserPurchasedBrandsQuery,
} from '../queries';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserQueries {
  constructor(private readonly apollo: Apollo) {}

  //-------------------------QUERIES----------------------
  async getUserByCredentials(
    userPassword: string,
    userName: string,
  ): Promise<partialUser | null> {
    const { data } = await firstValueFrom(
      this.apollo.query<{ getUserByCredentials: partialUser | null }>({
        query: getUserByCredentialsQuery,
        variables: { userPassword, userName },
        fetchPolicy: 'network-only',
      }),
    );

    return data.getUserByCredentials;
  }

  async getUserByName(userName: string): Promise<partialUser | null> {
    const { data } = await firstValueFrom(
      this.apollo.query<{ getUserByName: partialUser | null }>({
        query: getUserByNameQuery,
        variables: { userName },
        fetchPolicy: 'network-only',
      }),
    );

    return data.getUserByName;
  }

  async getUserPurchasedBrands(userId: string): Promise<string[]> {
    const { data } = await firstValueFrom(
      this.apollo.query<{ getUserPurchasedBrands: string[] }>({
        query: getUserPurchasedBrandsQuery,
        variables: { userId },
        fetchPolicy: 'network-only',
      }),
    );

    return data.getUserPurchasedBrands ?? [];
  }

  //-------------MUTATIONS-----------------------
  async insertUser(
    userPassword: string,
    userName: string,
  ): Promise<partialUser | undefined> {
    const { data } = await firstValueFrom(
      this.apollo.mutate<{ signUserUp: partialUser }>({
        mutation: signUserUpMutation,
        variables: { userPassword, userName },
      }),
    );
    
    return data?.signUserUp;
  }
}
