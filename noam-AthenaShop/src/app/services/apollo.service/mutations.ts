import { gql } from 'apollo-angular';

export const signUserUpMutation = gql`
  mutation ($userPassword: String!, $userName: String!) {
    signUserUp(userPassword: $userPassword, userName: $userName) {
      id
      userName
      role
      dateCreated
    }
  }
`;

export const inserPurchaseMutation = gql`
  mutation ($userId: String!, $itemId: String!) {
    purchaseItem(userId: $userId, itemId: $itemId)
  }
`;
