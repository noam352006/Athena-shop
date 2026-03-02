import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { MainService } from 'src/app/services/main.service/main.service';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';
import { ShoeItemQuery } from 'src/app/shared/states/shoeItems/shoe-item.query';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.less']
})
export class ShopComponent {
  constructor(private itemQuery: ShoeItemQuery, private mainService: MainService, private dialog: MatDialog) { }
  minCardsCount: number = 9;
  steps: number = 6;
  items$ = this.itemQuery.filteredShoes$;
  sortBy$ = new BehaviorSubject<string>('rating');
  currFilters$ = this.itemQuery.filters$;
  visibleCards$ = new BehaviorSubject<number>(this.minCardsCount);

  sorted$ = combineLatest([this.items$, this.sortBy$]).pipe(
    map(([shoes, currSort]) => {
      const copy = [...shoes];

      if (currSort === 'from-highest') {
        return copy.sort((a, b) => b.shoe.price - a.shoe.price);
      } else if (currSort === 'from-lowest') {
        return copy.sort((a, b) => Number(a.shoe.price) - Number(b.shoe.price));
      } else {
        return copy.sort((a, b) => b.shoe.rating - a.shoe.rating);
      }
    })
  );

  displayedCards$ = combineLatest([this.sorted$, this.visibleCards$]).pipe(
    map(([items, count]) => items.slice(0, count)));

  viewMore(): void {
    this.visibleCards$.next(this.visibleCards$.value + this.steps);
  }

  viewLess(): void {
    this.visibleCards$.next(this.minCardsCount);
  }

  close(filterName: string): void {
    this.mainService.close(filterName);
  }

  trackById(i: number, item: ShoeItem) :string {
    return item.id
  }

}