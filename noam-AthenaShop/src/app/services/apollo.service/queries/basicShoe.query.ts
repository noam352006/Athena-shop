import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';
import { BasicShoe } from 'src/app/shared/intrefaces/basicShoe';
import { getAllBasicShoesQuery } from '../queries';

@Injectable({
  providedIn: 'root',
})
export class BasicShoeQueries {
  constructor(private readonly apollo: Apollo) {}

  // ---------------- BASIC SHOES ----------------
  async getAllBasicShoes(): Promise<BasicShoe[]> {
    const { data } = await firstValueFrom(
      this.apollo.query<{ getAllBasicShoes: BasicShoe[] }>({
        query: getAllBasicShoesQuery,
      }),
    );
    
    return data.getAllBasicShoes;
  }
}
