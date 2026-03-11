import {Component, EventEmitter ,Input, Output, SimpleChanges,
} from '@angular/core';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { MainService } from 'src/app/services/main.service/main.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

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
      const isPurchased = this.mainService.isItemSoldOut(this.currShoe.id);

      this.sizes = result;
      isPurchased.subscribe((s) => (this.isSoldOut = s? true : false));
    }
  }

  buttonState!: string;
  stars = [1, 2, 3, 4, 5];
  chosenStars = 0;
  sizes!: number[];
  isSoldOut!: boolean;

  rate(number: number) {
    this.chosenStars = number;
  }

  onPurchase(): void {
    this.buttonState = 'loading';
    setTimeout(() => {
      this.purchaseItem();
    }, 2000);
  }

  purchaseItem(): void {
    this.mainService.purchaseItem(this.currShoe.id);
    this.openDialog(this.isSoldOut);
    this.buttonState = "disabled"
  }

  openDialog(canPurchase: Boolean) {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '30em',
      data: { success: !canPurchase },
    });
  }
}
