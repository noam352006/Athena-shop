import { ApolloClient, gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { ShoeItem } from 'src/interfaces/shoeItem';

@Injectable()
export class ShoesService {
  constructor(private readonly client: ApolloClient) {}

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
    try {
      const result = await this.client.mutate<{
        insert_purchases_one: { purchase_date: Date };
      }>({
        mutation: MUTATION,
        variables: { user_id: userId, shoe_id: itemID },
      });

      return result.data?.insert_purchases_one.purchase_date;
    } catch (error) {
      console.error('Error commit purchase from Hasura:', error);
      throw error;
    }
  }

  //---------------------------QUERIES------------------

  async getAllItems(): Promise<ShoeItem[] | undefined> {
    const QUERY = gql`
      query getAllItems {
        shoe_item {
          id
          size
          dateCreated
          shoe {
            brand
            id
            imgUrl
            model
            price
            rating
          }
          purchase {
            purchase_date
          }
        }
      }
    `;

    try {
      const result = await this.client.query<{ shoe_item: any[] }>({
        query: QUERY,
      });

      return result.data?.shoe_item.map((item) => {
        const newItem: ShoeItem = {
          id: item.id,
          size: item.size,
          dateCreated: item.dateCreated,
          shoe: item.shoe,
          datePurchased: item.purchase?.purchase_date,
        };

        return newItem;
      });
    } catch (error) {
      console.error('Error fetching shoe items:', error);
      throw error;
    }
  }

  async getAllPurchases(): Promise<ShoeItem[] | undefined> {
    const QUERY = gql`
      query getAllPurchases {
        purchases {
          shoe_item {
            id
            size
            dateCreated
            shoe {
              brand
              id
              imgUrl
              model
              price
              rating
            }
          }
        }
      }
    `;

    try {
      const result = await this.client.query<{
        purchases: { shoe_item: ShoeItem }[] | undefined;
      }>({
        query: QUERY,
      });

      return result.data?.purchases?.flatMap((p) => p.shoe_item);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      throw error;
    }
  }
}
