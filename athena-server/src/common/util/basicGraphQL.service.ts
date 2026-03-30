import { OperationVariables } from '@apollo/client';
import { ApolloClient, DocumentNode } from '@apollo/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BasicGraphQLService {
  constructor(private readonly client: ApolloClient) {}
  async queryEntity<T>(
    myQuery: DocumentNode,
    fieldName: string,
    vars?: NoInfer<OperationVariables>,
  ): Promise<T | null> {
    let result: T | null = null;

    try {
      const response = await this.client.query<Record<string, T>>({
        query: myQuery,
        variables: vars,
      });

      result = response.data?.[fieldName] ?? null;
    } catch (error) {
      console.error('Query failed:', error);
    }

    return result;
  }

  async mutateEntity<T>(
    myMutation: DocumentNode,
    fieldName: string,
    vars: NoInfer<OperationVariables>,
  ): Promise<T | null> {
    
    const result = await this.client.mutate<Record<string, T>>({
      mutation: myMutation,
      variables: vars,
    });
    
    return result.data?.[fieldName] ?? null;
  }
}
