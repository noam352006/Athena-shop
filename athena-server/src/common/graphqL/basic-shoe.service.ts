import { Injectable } from '@nestjs/common';
import { BasicShoe } from '../types/basic-shoe.type';
import { getAllBasicShoesQuery } from './queries';
import { BasicGraphQLService } from '../util/basicGraphQL.service';

@Injectable()
export class BasicShoeService {
  constructor(private graphQlService: BasicGraphQLService) {}

  async getAllBasicShoes(): Promise<BasicShoe[] | null> {
    const returnedFieldName = 'basicShoes'
    return this.graphQlService.getEntity<BasicShoe[]>(getAllBasicShoesQuery, returnedFieldName)
  }
}
