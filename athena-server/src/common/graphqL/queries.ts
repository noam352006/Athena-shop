import { gql } from '@apollo/client';

//----------------BASIC SHOES-----------------------

export const getAllBasicShoesQuery = gql`
  query getAllShoes {
    basic_shoe {
      brand
      id
      model
      price
      rating
      imgUrl
    }
  }
`;

//------------------SHOE ITEMS---------------------

export const getAllShoeItemsQuery = gql`
  query getAllItems {
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
      purchase {
        purchase_date
      }
    }
  }
`;

export const getAllPurchasesQuery = gql`
  query getAllPurchases {
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

//-----------------------USERS----------------------

export const getUserByCredentialsQuery = gql`
  query getUserByLogin($password: String!, $user_name: String!) {
    users_by_pk(password: $password, user_name: $user_name) {
      id
      user_name
      date_created
      role
    }
  }
`;

export const getUserByNameQuery = gql`
  query getUserByName($user_name: String!) {
    users(where: { user_name: { _eq: $user_name } }) {
      user_name
      id
      user_name
      date_created
      role
    }
  }
`;

export const getUserPurchasedBrandsQuery = gql`
  query getUserPurchasedBrands($id: uuid!) {
    purchases(where: { user_id: { _eq: $id } }) {
      shoe_item {
        shoe {
          brand
        }
      }
    }
  }
`;
