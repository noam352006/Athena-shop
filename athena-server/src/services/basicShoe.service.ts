import { ApolloClient, gql } from '@apollo/client';
import { DeepPartial } from '@apollo/client/utilities';
import { Injectable } from '@nestjs/common';
import { map, Observable, of } from 'rxjs';
import { BasicShoe } from 'src/interfaces/basicShoe';

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

    try {
      const result = await this.client.query<{
        basic_shoe: BasicShoe[] | undefined;
      }>({
        query: QUERY,
      });

      return result.data?.basic_shoe;
    } catch (error) {
      console.error('Error fetching basic shoes:', error);
      throw error;
    }
  }
}
