import { ApolloClient, gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { PartialUser } from 'src/common/types/partialUser.type';
import { mapUser } from '../util/query-result.mapper';
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

  async signUp(
    password: string,
    userName: string,
  ): Promise<PartialUser | undefined> {
    const user = await this.graphQLService.mutateEntity<rawUser>(
      signUpMutation,
      'insert_users_one',
      { password: password, user_name: userName },
    );

    console.log(`user service: insert with userName: ${userName} and password`);

    if (user) {
      return mapUser(user);
    }
  }

  async getUserByCredentials(
    userPassword: string,
    userName: string,
  ): Promise<PartialUser | null> {
    const returnedFieldName = 'users_by_pk';
    const user =
      (await this.graphQLService.queryEntity<rawUser>(
        getUserByCredentialsQuery,
        returnedFieldName,
        { password: userPassword, user_name: userName },
      )) ?? null;

    console.log(
      `user service: fetching user with userName: ${userName} and password`,
    );

    return user ? mapUser(user) : null;
  }

  async getUserByName(userName: string): Promise<PartialUser | null> {
    const returnedFieldName = 'users';
    const users =
      (await this.graphQLService.queryEntity<rawUser[]>(
        getUserByNameQuery,
        returnedFieldName,
        { user_name: userName },
      )) ?? [];

    console.log(`fetching user service: user with userName:  ${userName}`);

    return users[0] ? mapUser(users[0]) : null;
  }

  async getUserPurchasedBrands(userId: string): Promise<string[] | undefined> {
    if (userId) {
      const result = await this.client.query<{
        purchases: { shoeItem: { basicShoe: { brand: Brands[] } } }[];
      }>({
        query: getUserPurchasedBrandsQuery,
        variables: { id: userId },
      });

      console.log(
        `user service: fetching all purchased brand for userId ${userId}`,
      );

      return (
        result.data?.purchases?.flatMap(
          (purchase) => purchase.shoeItem.basicShoe?.brand,
        ) ?? []
      );
    }
  }
}
