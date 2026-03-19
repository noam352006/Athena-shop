import { ApolloClient, gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { PartialUser, UserRole } from 'src/common/types/partialUser.type';

@Injectable()
export class UserService {
  constructor(private readonly client: ApolloClient) {}

  //-------------MUTATIONS--------
  async signUp(password: string, userName: string): Promise<PartialUser> {
    const MUTATION = gql`
      mutation ($password: String!, $user_name: String!) {
        insert_users_one(
          object: { password: $password, user_name: $user_name }
        ) {
          id
          user_name
          role
          date_created
        }
      }
    `;
    const result = await this.client.mutate<{ insert_users_one: any }>({
      mutation: MUTATION,
      variables: { password, user_name: userName },
    });

    const user = result.data?.insert_users_one;

    return this.mapUser(user);
  }

  //-----------QUERIES----------
  async getUserByCredentials(
    userPassword: string,
    userName: string,
  ): Promise<PartialUser | null> {
    const QUERY = gql`
      query getUserByLogin($password: String!, $user_name: String!) {
        users_by_pk(password: $password, user_name: $user_name) {
          id
          user_name
          date_created
          role
        }
      }
    `;

    const result = await this.client.query<{ users_by_pk: any }>({
      query: QUERY,
      variables: {
        password: userPassword,
        user_name: userName,
      },
      fetchPolicy: 'network-only',
    });

    const user = result.data?.users_by_pk;

    if (!user) return null;

    return this.mapUser(user);
  }

  async getUserByName(userName: string): Promise<PartialUser | null> {
    const QUERY = gql`
      query getUserByName($user_name: String!) {
        users(where: { user_name: { _eq: $user_name } }) {
          user_name
          id
          user_name
          date_created
          role
        }
      }
    `;

    const result = await this.client.query<{
      users: any;
    }>({
      query: QUERY,
      variables: {
        user_name: userName,
      },
    });

    const user = result.data?.users[0];

    if (!user) return null;

    return this.mapUser(user);
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

  mapUser(queryResult: any): PartialUser {
    return {
      id: queryResult.id,
      userName: queryResult.user_name,
      role: queryResult.role ?? UserRole.Guest,
      dateCreated: new Date(queryResult.date_created),
    };
  }
}
