import { Injectable } from '@nestjs/common';
import { ShoeItem } from 'src/common/types/shoeItem.type';
import { purchaseItemMutation } from './mutation';
import { getAllPurchasesQuery, getAllShoeItemsQuery } from './queries';
import { mapItem, mapPurchase } from '../util/query-result.mapper';
import { rawPurchase, RawShoeItem } from '../types/rawTypes';
import { BasicGraphQLService } from '../util/basicGraphQL.service';

@Injectable()
export class ShoesService {
  constructor(private readonly graphQLService: BasicGraphQLService) {}

  async purchaseItem(
    userId: string,
    itemID: string,
  ): Promise<Date | undefined> {
    const returnedFieldName = 'insert_purchases_one';
    const newPurchase = await this.graphQLService.mutateEntity<rawPurchase>(
      purchaseItemMutation,
      returnedFieldName,
      { user_id: userId, shoe_id: itemID },
    );

    const purchseDate = newPurchase?.purchaseDate;
    console.log(
      `Item service: purchase item with id ${itemID} by user with id ${userId}`,
    );

    return purchseDate ? new Date(purchseDate!) : undefined;
  }

  async getAllShoeItems(): Promise<ShoeItem[] | undefined> {
    const returnedFieldName = 'shoeItems';
    const rawItems =
      (await this.graphQLService.queryEntity<RawShoeItem[]>(
        getAllShoeItemsQuery,
        returnedFieldName,
      )) ?? [];

    console.log('Item service: fetching all items');

    return rawItems.map((item) => mapItem(item));
  }

  async getAllPurchases(): Promise<ShoeItem[] | undefined> {
    const returnedFieldName = 'purchases';
    const rawPurchases = await this.graphQLService.queryEntity<
      rawPurchase[] | undefined
    >(getAllPurchasesQuery, returnedFieldName);

    console.log('Item service: fetching all purchases');

    return rawPurchases?.flatMap((purchase) =>
      mapPurchase(purchase?.shoeItem!, purchase?.purchaseDate!),
    );
  }
}
