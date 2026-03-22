import { ApolloClient, DocumentNode } from "@apollo/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BasicGraphQLService {
  constructor(private readonly client: ApolloClient) {}

  async getEntityArray<T>( myQuery: DocumentNode, fieldName: string): Promise<T[] | null> {
    const result = await this.client.query<Record<string, T[]>>({
      query: myQuery,
    });

    return result.data?.[fieldName] ?? null;
  }
}
