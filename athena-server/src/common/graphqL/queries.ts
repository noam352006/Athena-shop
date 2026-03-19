import { ApolloClient, gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { BasicShoe } from '../types/basic-shoe.type';
import { ShoeItem } from '../types/shoeItem.type';
import { mapItem, mapPurchase, mapUser } from '../util/query-result-map';
import { PartialUser } from '../types/partialUser.type';

@Injectable()
export class Queries {
  constructor(private readonly client: ApolloClient) {}

  async getAllBasicShoes(): Promise<BasicShoe[] | null> {
    const QUERY = gql`
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

    //----------------SHOE ITEMS---------------------

    const result = await this.client.query<{
      basic_shoe: BasicShoe[] | undefined;
    }>({
      query: QUERY,
    });

    return result.data?.basic_shoe?? null;
  }

  async getAllItems(): Promise<ShoeItem[] | undefined> {
      const QUERY = gql`
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
  
      const result = await this.client.query<{ shoe_item: any[] }>({
        query: QUERY,
        fetchPolicy: 'network-only',
      });
  
      return result.data?.shoe_item.map((item) => mapItem(item));
    }
  
    async getAllPurchases(): Promise<ShoeItem[] | undefined> {
      const QUERY = gql`
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
  
      const result = await this.client.query<{
        purchases: { purchaseDate: Date; shoe_item: ShoeItem }[] | undefined;
      }>({
        query: QUERY,
        fetchPolicy: 'network-only',
      });
  
      return result.data?.purchases?.flatMap((p) => mapPurchase(p.shoe_item, p.purchaseDate));
    }

    //------------USERS--------------------------


     async getUserByCredentials(
        userPassword: string,
        userName: string,
      ): Promise<PartialUser | null> {
        const QUERY = gql`
          query getUserByLogin($password: String!, $user_name: String!) {
            users_by_pk(password: $password, user_name: $user_name) {
              id
              user_name
              date_created
              role
            }
          }
        `;
    
        const result = await this.client.query<{ users_by_pk: any }>({
          query: QUERY,
          variables: {
            password: userPassword,
            user_name: userName,
          },
          fetchPolicy: 'network-only',
        });
    
        const user = result.data?.users_by_pk;
    
        if (!user) return null;
    
        return mapUser(user);
      }
    
      async getUserByName(userName: string): Promise<PartialUser | null> {
        const QUERY = gql`
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
    
        const result = await this.client.query<{
          users: any;
        }>({
          query: QUERY,
          variables: {
            user_name: userName,
          },
        });
    
        const user = result.data?.users[0];
    
        if (!user) return null;
    
        return mapUser(user);
      }
    
      async getUserPurchasedBrands(userId: string): Promise<string[] | undefined> {
        if (!userId) return [];
    
        const QUERY = gql`
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
    
        const result = await this.client.query<{
          purchases: { shoe_item: { shoe: { brand: string } } }[];
        }>({
          query: QUERY,
          variables: { id: userId },
          fetchPolicy: 'network-only'
        });
    
        return result.data?.purchases?.flatMap((p) => p.shoe_item.shoe.brand);
      }
}
