import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';
import { subscribeToPurchases } from '../subscribes';
import { getAllShoeItemsQuery } from '../queries';
import { inserPurchaseMutation } from '../mutations';

@Injectable({
  providedIn: 'root',
})
export class ItemQueries {
  constructor(private readonly apollo: Apollo) {}

  //-----------------QUERIES---------------------------------

  async getAllItems(): Promise<ShoeItem[]> {
    const { data } = await firstValueFrom(
      this.apollo.query<{ getAllShoeItems: ShoeItem[] }>({
        query: getAllShoeItemsQuery,
        fetchPolicy: 'network-only',
      }),
    );
    return data.getAllShoeItems;
  }

  //---------------------SUBSCRIPTION----------------------------

  subscribeToPurhases(): Observable<ShoeItem[] | undefined> {
    return this.apollo
      .subscribe<{
        purchases: { purchaseDate: Date; shoe_item: ShoeItem }[] | undefined;
      }>({
        query: subscribeToPurchases,
      })
      .pipe(
        map((result) =>
          result.data!.purchases?.flatMap((p) => {
            const item = p.shoe_item;

            const newItem: ShoeItem = {
              id: item.id,
              size: item.size,
              dateCreated: new Date(item.dateCreated),
              shoe: item.shoe,
              datePurchased: p.purchaseDate
                ? new Date(p.purchaseDate)
                : undefined,
            };

            return newItem;
          }),
        ),
      );
  }

  //------------------MUTATIONS-----------------------

  async insertPurchase(
    userId: string,
    itemId: string,
  ): Promise<Date | undefined> {
    console.log('adding purchase', itemId, userId);
    const { data } = await firstValueFrom(
      this.apollo.mutate<{ purchaseItem: Date }>({
        mutation: inserPurchaseMutation,
        variables: { userId, itemId },
      }),
    );
    return data?.purchaseItem;
  }
}
