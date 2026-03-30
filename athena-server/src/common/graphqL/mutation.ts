import { gql } from '@apollo/client';

export const purchaseItemMutation = gql`
  mutation purchaseShoe($user_id: uuid!, $shoe_id: uuid!) {
    insert_purchases_one(object: { user_id: $user_id, item_id: $shoe_id }) {
      purchaseDate: purchase_date
    }
  }
`;

export const signUpMutation = gql`
  mutation ($password: String!, $user_name: String!) {
    insert_users_one(object: { password: $password, user_name: $user_name }) {
      id
      user_name
      role
      dateCreated: date_created
    }
  }
`;
