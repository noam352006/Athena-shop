import { ApolloClient, gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { PartialUser } from 'src/classes/partialUser';

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
    try {
      const result = await this.client.mutate<{ insert_users_one: any }>({
        mutation: MUTATION,
        variables: { password, user_name: userName },
      });

      const user = result.data?.insert_users_one;
      return {
        id: user.id,
        userName: user.user_name,
        role: user.role,
        dateCreated: user.date_created,
      };
    } catch (error) {
      console.error('Error fetching SHOE ITEMS from Hasura:', error);
      throw error;
    }
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
          role
          date_created
        }
      }
    `;

    try {
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

      return {
        id: user.id,
        userName: user.user_name,
        role: user.role,
        dateCreated: user.date_created,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async getUserByName(userName: string): Promise<string | null> {
    const QUERY = gql`
      query getUserByName($user_name: String!) {
        users(where: { user_name: { _eq: $user_name } }) {
          user_name
        }
      }
    `;

    try {
      const result = await this.client.query<{
        users: { user_name: string }[];
      }>({
        query: QUERY,
        variables: {
          user_name: userName,
        },
        fetchPolicy: 'network-only',
      });

      const user = result.data?.users[0];

      if (!user) return null;

      return user.user_name;
    } catch (error) {
      console.error('Error fetching user by name:', error);
      throw error;
    }
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

    try {
      const result = await this.client.query<{
        purchases: { shoe_item: { shoe: { brand: string } } }[];
      }>({
        query: QUERY,
        variables: { id: userId },
      });

      return result.data?.purchases.flatMap((p) => p.shoe_item.shoe.brand);
    } catch (error) {
      console.error('Error fetching purchased brands:', error);
      throw error;
    }
  }
}
