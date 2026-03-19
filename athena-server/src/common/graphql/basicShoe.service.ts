import { ApolloClient, gql } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { BasicShoe } from '../types/basicShoe.type';

@Injectable()
export class BasicShoeService {
  constructor(private readonly client: ApolloClient) {}

  async getAllBasicShoes(): Promise<BasicShoe[] | undefined> {
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

    const result = await this.client.query<{
      basic_shoe: BasicShoe[] | undefined;
    }>({
      query: QUERY,
    });

    return result.data?.basic_shoe;
  }
}
