import { Provider } from '@nestjs/common';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';

export const ApolloClientProvider: Provider = {
  provide: ApolloClient,
  useFactory: () => {
    return new ApolloClient({
      link: new HttpLink({
        uri: 'https://helpful-crow-38.hasura.app/v1/graphql', 
        headers: {
          'x-hasura-admin-secret': 'EwBu!b6BtYus83u',
        },
        fetch,
      }),
      cache: new InMemoryCache(),
    });
  },
};

