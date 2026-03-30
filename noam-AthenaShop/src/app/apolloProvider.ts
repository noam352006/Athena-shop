import {
  ApolloClient,
  InMemoryCache,
  split,
} from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Provider } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';

export const ApolloClientProvider: Provider = {
  provide: APOLLO_OPTIONS,
  useFactory: (httpLink: HttpLink) => {
    const http = httpLink.create({
      uri: environment.serverUrl,
    });

    const ws = new GraphQLWsLink(
      createClient({
        url: environment.hasuraWsUrl,
        connectionParams: {
          headers: {
            'x-hasura-admin-secret': environment.hsuraAdminSecret,
          },
        },
      }),
    );

    const link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      ws, //subscription
      http, //כל השאר
    );

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  },
  deps: [HttpLink],
};