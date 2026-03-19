import { PartialUser, UserRole } from '../types/partialUser.type';
import { ShoeItem } from '../types/shoeItem.type';

export function mapUser(queryResult: any): PartialUser {
  return {
    id: queryResult.id,
    userName: queryResult.user_name,
    role: queryResult.role ?? UserRole.Guest,
    dateCreated: new Date(queryResult.date_created),
  };
}

export function mapPurchase(item: any, purchaseDate: Date): ShoeItem {
  return {
    id: item.id,
    size: item.size,
    dateCreated: new Date(item.dateCreated),
    shoe: item.shoe,
    datePurchased: purchaseDate ? new Date(purchaseDate) : undefined,
  };
}

export function mapItem(item: any): ShoeItem {
  return {
    id: item.id,
    size: item.size,
    dateCreated: new Date(item.dateCreated),
    shoe: item.shoe,
    datePurchased: item.purchase?.purchase_date
      ? new Date(item.purchase?.purchase_date)
      : undefined,
  };
}
