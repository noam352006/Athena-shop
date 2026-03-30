import { Provider } from '@nestjs/common';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';
import { ConfigService } from '@nestjs/config';

export const ApolloClientProvider: Provider = {
  provide: ApolloClient,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {

    return new ApolloClient({
      link: new HttpLink({
        uri:  configService.get<string>('HASURA_URL')!, 
        headers: {
          'x-hasura-admin-secret': configService.get<string>('HASURA_ADMIN_SECRET')!,
        },
        fetch,
      }),
      cache: new InMemoryCache(),
    });
  },
};

