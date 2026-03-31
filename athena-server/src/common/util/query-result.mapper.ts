import { PartialUser, UserRole } from '../types/partialUser.type';
import { RawShoeItem, rawUser } from '../types/rawTypes';
import { ShoeItem } from '../types/shoeItem.type';

export function mapUser(queryResult: rawUser): PartialUser {
  return {
    id: queryResult.id,
    userName: queryResult.user_name,
    role: queryResult.role ?? UserRole.Guest,
    dateCreated: new Date(queryResult.date_created),
  };
}

export function mapPurchase(item: RawShoeItem, purchaseDate: Date): ShoeItem {
  return {
    id: item.id,
    size: item.size,
    dateCreated: new Date(item.dateCreated),
    shoe: item.shoe,
    datePurchased: purchaseDate ? new Date(purchaseDate) : null,
  };
}

export function mapItem(item: RawShoeItem): ShoeItem {
  return {
    id: item.id,
    size: item.size,
    dateCreated: new Date(item.dateCreated),
    shoe: item.shoe,
    datePurchased: item.purchase?.purchase_date
      ? new Date(item.purchase?.purchase_date)
      : null,
  };
}
