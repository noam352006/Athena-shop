import { ApolloClient, gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { PartialUser, UserRole } from 'src/common/types/partialUser.type';
import { mapUser } from '../util/query-result-map';
import { signUpMutation } from './mutation';
import { getUserByCredentialsQuery, getUserByNameQuery } from './queries';

@Injectable()
export class UserService {
  constructor(private readonly client: ApolloClient) {}

  //-------------MUTATIONS--------
  async signUp(password: string, userName: string): Promise<PartialUser> {

    const result = await this.client.mutate<{ insert_users_one: any }>({
      mutation: signUpMutation,
      variables: { password, user_name: userName },
    });

    const user = result.data?.insert_users_one;

    return mapUser(user);
  }

  //-----------QUERIES----------
  async getUserByCredentials(
    userPassword: string,
    userName: string,
  ): Promise<PartialUser | null> {

    const result = await this.client.query<{ users_by_pk: any }>({
      query: getUserByCredentialsQuery,
      variables: {
        password: userPassword,
        user_name: userName,
      },
      fetchPolicy: 'network-only',
    });

    const user = result.data?.users_by_pk;

    if (!user) return null;

    return mapUser(user);
  }

  async getUserByName(userName: string): Promise<PartialUser | null> {

    const result = await this.client.query<{
      users: any;
    }>({
      query: getUserByNameQuery,
      variables: {
        user_name: userName,
      },
    });

    const user = result.data?.users[0];

    if (!user) return null;

    return mapUser(user);
  }

  async getUserPurchasedBrands(userId: string): Promise<string[] | undefined> {
    if (!userId) return [];

    const QUERY = gql`
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

    const result = await this.client.query<{
      purchases: { shoe_item: { shoe: { brand: string } } }[];
    }>({
      query: QUERY,
      variables: { id: userId },
      fetchPolicy: 'network-only'
    });

    return result.data?.purchases?.flatMap((p) => p.shoe_item.shoe.brand);
  }
}
