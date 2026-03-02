import { Component, OnInit } from '@angular/core';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { shoeItemService } from 'src/app/shared/states/shoeItems/shoe-item.service';
import { ShoeItemQuery } from 'src/app/shared/states/shoeItems/shoe-item.query';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.less']
})
export class SliderComponent implements OnInit {

  constructor( private shoeService: shoeItemService, private itemQuery: ShoeItemQuery) { }
  min = 0;
  max = 200;
  step = 1;
  currFilters$ = this.itemQuery.filters$;
  options!: Options;

  ngOnInit(): void {
    this.buildOptions(this.min, this.max);
  }

  private buildOptions(low: number, high: number): void {
    this.options = {
      floor: this.min,
      ceil: this.max,
      step: this.step,
      showSelectionBar: false,
      hideLimitLabels: true,
      translate: (value: number, label: LabelType): string => `$${value}`
    };
  }

  onUserChange(changeContext: any): void {
    const low = changeContext.value;
    const high = changeContext.highValue;
    this.shoeService.updateFilter({ minPrice: low, maxPrice: high });
    this.buildOptions(low, high);

  }
}
