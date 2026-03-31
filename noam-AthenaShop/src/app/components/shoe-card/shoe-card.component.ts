import { Component, Input, SimpleChanges } from '@angular/core';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { ShopService } from 'src/app/services/shop.service/shop.service';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, tap } from 'rxjs';

@Component({
  selector: 'app-shoe-card',
  templateUrl: './shoe-card.component.html',
  styleUrls: ['./shoe-card.component.less'],
})
export class ShoeCardComponent {
  @Input() currShoe!: ShoeItem;
  @Input() isInMainPage?: boolean;

  constructor(
    private shopService: ShopService,
    private dialog: MatDialog,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currShoe'] && this.currShoe) {
      const result = this.shopService.getShoeSizes(this.currShoe.shoe.id);
      this.sizes = result;
      this.shopService
        .isItemSoldOut(this.currShoe.id)
        .subscribe((isSoldOut) => {
          this.isPurchased$.next(!!isSoldOut);
        });
    }
  }

  isPurchased$ = new BehaviorSubject<boolean>(false);

  buttonState!: string;
  stars = [1, 2, 3, 4, 5];
  chosenStars = 0;
  sizes!: number[];

  rate(number: number) {
    this.chosenStars = number;
  }

  onPurchase(): void {
    this.buttonState = 'loading';
    setTimeout(() => {
      this.purchaseItem();
    }, 2000);
  }

  async purchaseItem(): Promise<void> {
    await this.shopService.didPurchaseItem(this.currShoe.id);
    this.openDialog();
    this.buttonState = 'disabled';
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '30em',
      data: { success: true },
    });
  }
}
