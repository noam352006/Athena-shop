import { OperationVariables } from "@apollo/client";
import { ApolloClient, DocumentNode } from "@apollo/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BasicGraphQLService {
  constructor(private readonly client: ApolloClient) {}

  async getEntity<T>( myQuery: DocumentNode, fieldName: string, vars?: NoInfer<OperationVariables>): Promise<T | null> {
    const result = await this.client.query<Record<string, T>>({
      query: myQuery,
      variables: vars,
    });

    return result.data?.[fieldName] ?? null;
  }

  async mutate<T>( myMutation: DocumentNode, fieldName: string, vars: NoInfer<OperationVariables>): Promise<T | null> {
    const result = await this.client.mutate<Record<string, T>>({
      mutation: myMutation,
      variables: vars,
    });

    return result.data?.[fieldName] ?? null;
  }
}
