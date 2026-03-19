import { Component, Input, SimpleChanges } from '@angular/core';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { MainService } from 'src/app/services/main.service/main.service';
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
    private mainService: MainService,
    private dialog: MatDialog,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currShoe'] && this.currShoe) {
      const result = this.mainService.getShoeSizes(this.currShoe.shoe.id);
      this.sizes = result;
      this.mainService
        .isItemSoldOut(this.currShoe.id)
        .subscribe((isSoldOut) => {
          this.isPurchased$.next(isSoldOut ? true : false);
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
    await this.mainService.didPurchaseItem(this.currShoe.id);
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
