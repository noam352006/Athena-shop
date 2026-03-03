
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { NgModule } from '@angular/core';

const myUri = 'http://localhost:4000/https://helpful-crow-38.hasura.app/v1/graphql'; // GraphQL server URL

@NgModule({
  imports: [
    ApolloModule,
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: '',
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class AppModule {}