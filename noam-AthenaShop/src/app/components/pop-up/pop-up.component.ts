import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.less']
})
export class PopUpComponent {

  constructor(public ref: MatDialogRef<PopUpComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  soldOutText: string = 'This shoe is SOLD OUT.\nLuckly, we have many other great shoes for you to choose from😉';

  click(): void {
    this.ref.close;
  }
}
