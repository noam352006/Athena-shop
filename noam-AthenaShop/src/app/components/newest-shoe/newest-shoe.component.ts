import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Brands } from 'src/app/shared/enums/brand.enum';
import { BasicShoe } from 'src/app/shared/intrefaces/basicShoe';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';

@Component({
  selector: 'app-newest-shoe',
  templateUrl: './newest-shoe.component.html',
  styleUrls: ['./newest-shoe.component.less'],
})
export class NewestShoeComponent {
  @Output() goToShop = new EventEmitter<void>();
  @Input() currShoe?: ShoeItem;

  sshoe: BasicShoe = {
    id: '0',
    brand: [Brands.Adidas, Brands.Yeezy],
    model: '350 BELUGA',
    rating: 3,
    price: 55,
    imgUrl: '../../../assets/items/adidas_yeezy_350_beluga.png',
  };

  currShoee: ShoeItem = {
    id: '1',
    shoe: this.sshoe,
    dateCreated: new Date(),
    datePurchased: undefined,
    size: 7.5,
  };

  text: string = `And take your time to browse
  our fine shoe collection!`;

  onClick(): void {
    this.goToShop.emit();
  }
}
