import { Injectable } from '@nestjs/common';
import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client/core';
import fetch from 'node-fetch';

@Injectable()
export class AppService {
  private apolloClient: ApolloClient;

  constructor() {
    // הגדרת החיבור ל-Hasura
    this.apolloClient = new ApolloClient({
      link: new HttpLink({ 
        uri: 'https://helpful-crow-38.hasura.app/v1/graphql', // הכתובת של ה-GraphQL API שלך
        fetch: fetch as any,
        headers: {
          'x-hasura-admin-secret': 'NU6VbveJ97irpguhPSWQtrXhhvFCq4kP75IKKkql3viL0zUO0HCDJZZecH8txTjU', // הסוד שלך (אם קיים)
        },
      }),
      cache: new InMemoryCache(),
    });
  }


async getDataFromHasura() {
    const QUERY = gql`
      query MyQuery {
        users { # כאן תכתבי שאילתה שקיימת אצלך ב-Hasura
          id
          name
        }
      }
    `;

    try {
      const result = await this.apolloClient.query({ query: QUERY });
      return result.data;
    } catch (error) {
      console.error("Error fetching from Hasura:", error);
      throw error;
    }
  }
}