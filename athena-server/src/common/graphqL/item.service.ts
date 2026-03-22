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
  constructor(
    private readonly client: ApolloClient,
    private readonly graphQLService: BasicGraphQLService,
  ) {}

  //------MUTATIONS----------------
  async purchaseItem(
    userId: string,
    itemID: string,
  ): Promise<Date | undefined> {
    const returnedFieldName = 'insert_purchases_one';
    const newPurchase = await this.graphQLService.mutate<rawPurchase>(
      purchaseItemMutation,
      returnedFieldName,
      { user_id: userId, shoe_id: itemID },
    );

    const purchseDate = newPurchase?.purchaseDate;
    if (!purchseDate) {
      return undefined;
    }

    return new Date(purchseDate!);
  }

  //---------------------------QUERIES------------------
  async getAllShoeItems(): Promise<ShoeItem[] | undefined> {
    const returnedFieldName = 'shoeItems';
    const rawItems =
      (await this.graphQLService.getEntity<RawShoeItem[]>(
        getAllShoeItemsQuery,
        returnedFieldName,
      )) ?? [];

    return rawItems.map((item) => mapItem(item));
  }

  async getAllPurchases(): Promise<ShoeItem[] | undefined> {
    const returnedFieldName = 'purchases';
    const rawPurchases = await this.graphQLService.getEntity<
      rawPurchase[] | undefined
    >(getAllPurchasesQuery, returnedFieldName);

    return rawPurchases?.flatMap((p) =>
      mapPurchase(p?.shoeItem!, p?.purchaseDate!),
    );
  }
}
