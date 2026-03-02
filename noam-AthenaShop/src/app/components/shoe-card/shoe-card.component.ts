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
  @Output() clickedPurchase = new EventEmitter<void>();

  constructor(
    private mainService: MainService,
    private dialog: MatDialog,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currShoe'] && this.currShoe) {
      const result = this.mainService.getShoeSizes(this.currShoe.shoe.id);

      // אם getShoeSizes מחזיר Observable → נרשם אליו
      if (result instanceof Observable) {
        result.subscribe((s) => (this.sizes = s));
      } else {
        // אחרת מניחים שמדובר במערך סינכרוני
        this.sizes = result;
      }
    }
  }

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

  purchaseItem(): void {
    const isShoeAvailable = this.mainService.purchaseItem(this.currShoe);
    this.openDialog(isShoeAvailable);
    this.buttonState = isShoeAvailable ? 'purchased' : 'disabled';
  }

  openDialog(canPurchase: Boolean) {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '30em',
      data: { success: canPurchase },
    });
  }
}
