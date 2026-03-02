import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';

@Component({
  selector: 'app-newest-shoe',
  templateUrl: './newest-shoe.component.html',
  styleUrls: ['./newest-shoe.component.less']
})
export class NewestShoeComponent{
  @Output() goToShop = new EventEmitter<void>();
  @Input() currShoe?: ShoeItem;

  text: string =
    `And take your time to browse
  our fine shoe collection!`

  onClick(): void {
    this.goToShop.emit();
  }
}
