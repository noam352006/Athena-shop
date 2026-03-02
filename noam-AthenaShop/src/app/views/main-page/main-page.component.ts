import { Component } from '@angular/core';
import { MainService } from 'src/app/services/main.service/main.service';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent {

  constructor(private service: MainService) { }

  bestSeller: ShoeItem = this.service.getMostBought();
  newestShoe: Observable<ShoeItem> = this.service.getNewestShoe();
  recommendedShoes: Observable<ShoeItem[]> = this.service.getTopSuggestionsForUser();

  text =
    `
We believe every step tells a tale.Founded by passionate footwear enthusiasts, our boutique blends timeless classics with the-latest trends,offering hand‑picked shoes that give you comfort, quality, and style. From city‑slick sneakers to handcrafted leather-boots, we curate collections that inspire confidence and keep you moving                       -forward, one perfect pair at a time.`


  purchase(shoe: ShoeItem) {
    this.service.purchaseItem(shoe)
  }

  navigateToShop(): void {
    this.service.navToShop();
  }

}
