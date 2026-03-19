import { ApolloClient, gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { PartialUser } from 'src/common/types/partialUser.type';
import { mapUser } from '../util/query-result-map';
import { signUpMutation } from './mutation';
import { getUserByCredentialsQuery, getUserByNameQuery, getUserPurchasedBrandsQuery } from './queries';
import { rawUser } from '../types/rawTypes';
import { BasicShoe, Brands } from '../types/basic-shoe.type';

@Injectable()
export class UserService {
  constructor(private readonly client: ApolloClient) {}

  //-------------MUTATIONS--------
  async signUp(password: string, userName: string): Promise<PartialUser | undefined> {

    const result = await this.client.mutate<{ insert_users_one: rawUser }>({
      mutation: signUpMutation,
      variables: { password, user_name: userName },
    });

    const user = result.data?.insert_users_one;

    if(user){
    return mapUser(user);
    }
  }

  //-----------QUERIES----------
  async getUserByCredentials(
    userPassword: string,
    userName: string,
  ): Promise<PartialUser | null> {

    const result = await this.client.query<{ users_by_pk: rawUser }>({
      query: getUserByCredentialsQuery,
      variables: {
        password: userPassword,
        user_name: userName,
      },
    });

    const user = result.data?.users_by_pk;

    return user ? mapUser(user): null;
  }

  async getUserByName(userName: string): Promise<PartialUser | null> {
    const result = await this.client.query<{
      users: rawUser[];
    }>({
      query: getUserByNameQuery,
      variables: {
        user_name: userName,
      },
    });

    const user = result.data?.users[0];

    return user ? mapUser(user): null;
  }

  async getUserPurchasedBrands(userId: string): Promise<string[] | undefined> {
    if (!userId) return [];

    const result = await this.client.query<{
      purchases: { shoeItem: { basicShoe: {brand: Brands[]} } }[];
    }>({
      query: getUserPurchasedBrandsQuery,
      variables: { id: userId },
    });

    return result.data?.purchases?.flatMap((purchase) => purchase.shoeItem.basicShoe?.brand);
  }
}
