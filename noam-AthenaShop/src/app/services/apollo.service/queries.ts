import { gql } from 'apollo-angular';

//------------BASIC SHOES--------------

export const getAllBasicShoesQuery = gql`
  query {
    getAllBasicShoes {
      id
      brand
      model
      price
      rating
      imgUrl
    }
  }
`;

//----------------SHOE ITEMS---------

export const getAllShoeItemsQuery = gql`
  query {
    getAllShoeItems {
      id
      size
      dateCreated
      datePurchased
      shoe {
        id
        brand
        model
        price
        rating
        imgUrl
      }
    }
  }
`;

//-----------------users---------------
export const getUserByCredentialsQuery = gql`
  query ($userPassword: String!, $userName: String!) {
    getUserByCredentials(userPassword: $userPassword, userName: $userName) {
      id
      userName
      role
      dateCreated
    }
  }
`;

export const getUserByNameQuery = gql`
  query ($userName: String!) {
    getUserByName(userName: $userName) {
      id
      userName
      role
      dateCreated
    }
  }
`;

export const getUserPurchasedBrandsQuery = gql`
  query ($userId: String!) {
    getUserPurchasedBrands(user_id: $userId)
  }
`;
