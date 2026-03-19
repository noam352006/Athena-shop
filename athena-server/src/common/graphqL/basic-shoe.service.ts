import { ApolloClient } from '@apollo/client';
import { Injectable } from '@nestjs/common';
import { BasicShoe } from '../types/basic-shoe.type';
import { getAllBasicShoesQuery } from './queries';

@Injectable()
export class BasicShoeService {
  constructor(private readonly client: ApolloClient) {}

  async getAllBasicShoes(): Promise<BasicShoe[] | null> {
    const result = await this.client.query<{
      basic_shoe: BasicShoe[] | undefined;
    }>({
      query: getAllBasicShoesQuery,
    });

    return result.data?.basic_shoe?? null;
  }
}
