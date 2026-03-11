import { Component } from '@angular/core';
import { MainService } from 'src/app/services/main.service/main.service';
import { ShoeItem } from 'src/app/shared/intrefaces/shoeItem';
import { Observable, tap } from 'rxjs';
import { ApolloService } from 'src/app/services/apollo.service/apollo.service';
import { BasicShoe } from 'src/app/shared/intrefaces/basicShoe';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent {

  constructor(private service: MainService, private aps: ApolloService) { }

  bestSeller$: Observable<BasicShoe | undefined> = this.service.getMostBought();
  newestShoe$: Observable<ShoeItem | null> = this.service.getNewestShoe();
  recommendedShoes: Observable<ShoeItem[]> = this.service.getTopSuggestionsForUser();

  text =
    `
We believe every step tells a tale.Founded by passionate footwear enthusiasts, our boutique blends timeless classics with the-latest trends,offering hand‑picked shoes that give you comfort, quality, and style. From city‑slick sneakers to handcrafted leather-boots, we curate collections that inspire confidence and keep you moving-forward, one perfect pair at a time.`

  navigateToShop(): void {
    this.service.navToShop();
  }

  pop(){
    alert("hi");
  }
 }
