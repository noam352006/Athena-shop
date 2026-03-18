import { Injectable } from '@angular/core';
import { Apollo,  } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  constructor(private readonly apollo: Apollo) {}

}
