import { Provider } from '@nestjs/common';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';

export const ApolloClientProvider: Provider = {
  provide: ApolloClient,
  useFactory: () => {
    return new ApolloClient({
      link: new HttpLink({
        uri: 'https://your-hasura-endpoint/v1/graphql', 
        headers: {
          'x-hasura-admin-secret': 'NU6VbveJ97irpguhPSWQtrXhhvFCq4kP75IKKkql3viL0zUO0HCDJZZecH8txTjU',
        },
        fetch,
      }),
      cache: new InMemoryCache(),
    });
  },
};

