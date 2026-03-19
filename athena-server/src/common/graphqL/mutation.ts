import { ApolloClient, gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { PartialUser } from 'src/common/types/partialUser.type';
import { mapUser } from '../util/query-result-map';

@Injectable()
export class Mutations {
  constructor(private readonly client: ApolloClient) {}

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

    return mapUser(user);
  }

  async purchaseItem(
    userId: string,
    itemID: string,
  ): Promise<Date | undefined> {
    const MUTATION = gql`
      mutation purchaseShoe($user_id: uuid!, $shoe_id: uuid!) {
        insert_purchases_one(object: { user_id: $user_id, item_id: $shoe_id }) {
          purchase_date
        }
      }
    `;
    const result = await this.client.mutate<{
      insert_purchases_one: { purchase_date: Date };
    }>({
      mutation: MUTATION,
      variables: { user_id: userId, shoe_id: itemID },
    });

    const purchseDate = result.data?.insert_purchases_one?.purchase_date;
    if (!purchseDate) {
      return undefined;
    }

    return new Date(purchseDate!);
  }
}
