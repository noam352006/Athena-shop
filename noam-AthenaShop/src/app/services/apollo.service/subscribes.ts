import { gql } from 'apollo-angular';

export const subscribeToPurchases = gql`
  subscription subscribeToPurchases {
    purchases {
      purchase_date
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
