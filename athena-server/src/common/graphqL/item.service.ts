import { ApolloClient, gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { ShoeItem } from 'src/common/types/shoeItem.type';
import { purchaseItemMutation } from './mutation';
import { getAllPurchasesQuery, getAllShoeItemsQuery } from './queries';
import { mapItem, mapPurchase } from '../util/query-result-map';
import { RawShoeItem } from '../types/rawTypes';

@Injectable()
export class ShoesService {
  constructor(private readonly client: ApolloClient) {}

  //------MUTATIONS----------------
  async purchaseItem(
    userId: string,
    itemID: string,
  ): Promise<Date | undefined> {
    const result = await this.client.mutate<{
      insert_purchases_one: { purchase_date: Date };
    }>({
      mutation: purchaseItemMutation,
      variables: { user_id: userId, shoe_id: itemID },
    });

    const purchseDate = result.data?.insert_purchases_one?.purchase_date;
    if (!purchseDate) {
      return undefined;
    }

    return new Date(purchseDate!);
  }

  //---------------------------QUERIES------------------
  async getAllShoeItems(): Promise<ShoeItem[] | undefined> {
    const result = await this.client.query<{ shoeItems: RawShoeItem[] }>({
      query: getAllShoeItemsQuery,
    });

    const items = result.data?.shoeItems ?? [];
    return items.map((item) => mapItem(item));
  }

  async getAllPurchases(): Promise<ShoeItem[] | undefined> {
    const result = await this.client.query<{
      purchases: { purchaseDate: Date; shoeItems: RawShoeItem }[] | undefined;
    }>({
      query: getAllPurchasesQuery,
    });

    return result?.data?.purchases?.flatMap((p) =>
      mapPurchase(p.shoeItems, p.purchaseDate),
    );
  }
}
