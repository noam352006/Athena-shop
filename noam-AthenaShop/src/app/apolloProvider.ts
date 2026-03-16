import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Provider } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';

export const ApolloClientProvider: Provider = {
provide: APOLLO_OPTIONS,
  useFactory: (httpLink: HttpLink) => {
    
    const http = httpLink.create({
      uri: 'http://localhost:3000/graphql',
    });

    const ws = new GraphQLWsLink(
      createClient({
        url: 'wss://helpful-crow-38.hasura.app/v1/graphql', 
        connectionParams: {
          headers: {
            'x-hasura-admin-secret': 'NU6VbveJ97irpguhPSWQtrXhhvFCq4kP75IKKkql3viL0zUO0HCDJZZecH8txTjU',
          },
        },
      })
    );

    const link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      ws,   // לאן הולך ה-subscription
      http  // לאן הולך כל השאר
    );

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  },
  deps:[HttpLink],
  
};