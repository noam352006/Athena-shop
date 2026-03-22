import { ApolloClient, gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { PartialUser } from 'src/common/types/partialUser.type';
import { mapUser } from '../util/query-result-map';
import { signUpMutation } from './mutation';
import {
  getUserByCredentialsQuery,
  getUserByNameQuery,
  getUserPurchasedBrandsQuery,
} from './queries';
import { rawUser } from '../types/rawTypes';
import { Brands } from '../types/basic-shoe.type';
import { BasicGraphQLService } from '../util/basicGraphQL.service';

@Injectable()
export class UserService {
  constructor(
    private readonly client: ApolloClient,
    private graphQLService: BasicGraphQLService,
  ) {}

  //-------------MUTATIONS--------
  async signUp(
    password: string,
    userName: string,
  ): Promise<PartialUser | undefined> {
    const user = await this.graphQLService.mutate<rawUser>(
      signUpMutation,
      'insert_users_one',
      { password: password, user_name: userName }
    )

    if (user) {
      return mapUser(user);
    }
  }

  //-----------QUERIES----------
  async getUserByCredentials(
    userPassword: string,
    userName: string,
  ): Promise<PartialUser | null> {
    const returnedFieldName = 'users_by_pk';
    const user =
      (await this.graphQLService.getEntity<rawUser>(
        getUserByCredentialsQuery,
        returnedFieldName,
        { password: userPassword, user_name: userName },
      )) ?? undefined;

    return user ? mapUser(user) : null;
  }

  async getUserByName(userName: string): Promise<PartialUser | null> {
    const returnedFieldName = 'users';
    const users =
      (await this.graphQLService.getEntity<rawUser[]>(
        getUserByNameQuery,
        returnedFieldName,
        { user_name: userName },
      )) ?? [];

    const user = users[0];

    return user ? mapUser(user) : null;
  }

  async getUserPurchasedBrands(userId: string): Promise<string[] | undefined> {
    if (!userId) return [];

    const result = await this.client.query<{
      purchases: { shoeItem: { basicShoe: { brand: Brands[] } } }[];
    }>({
      query: getUserPurchasedBrandsQuery,
      variables: { id: userId },
    });

    return result.data?.purchases?.flatMap(
      (purchase) => purchase.shoeItem.basicShoe?.brand,
    );
  }
}
