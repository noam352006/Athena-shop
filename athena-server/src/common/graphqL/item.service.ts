import { ApolloClient, gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { ShoeItem } from 'src/common/types/shoeItem.type';
import { purchaseItemMutation } from './mutation';
import { getAllPurchasesQuery, getAllShoeItemsQuery } from './queries';
import { mapItem, mapPurchase } from '../util/query-result-map';
import { rawPurchase, RawShoeItem } from '../types/rawTypes';
import { BasicGraphQLService } from '../util/basicGraphQL.service';

@Injectable()
export class ShoesService {
  constructor(private readonly client: ApolloClient, private readonly graphQLService: BasicGraphQLService) {}

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
    const returnedFieldName = 'shoeItems'
    const rawItems =  await this.graphQLService.getEntityArray<RawShoeItem>(getAllShoeItemsQuery, returnedFieldName)?? [];

    return rawItems.map((item) => mapItem(item));
  }

  async getAllPurchases(): Promise<ShoeItem[] | undefined> {

    const returnedFieldName = 'purchases'
    const rawPurchases =  await this.graphQLService.getEntityArray<rawPurchase | undefined>
      (getAllPurchasesQuery, returnedFieldName);

    return rawPurchases?.flatMap((p) =>
      mapPurchase(p?.shoeItem!, p?.purchaseDate!)
    );
  }
}
