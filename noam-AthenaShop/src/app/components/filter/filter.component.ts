import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, Subject, take, takeUntil, tap } from 'rxjs';
import { Brands } from 'src/app/shared/enums/brand.enum';
import { ShoeItemQuery } from 'src/app/shared/states/shoeItems/shoe-item.query';
import { shoeItemService } from 'src/app/shared/states/shoeItems/shoe-item.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.less'],
})
export class FilterComponent {
  sizes: number[] = [3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5];
  currFilters$ = this.itemQuery.filters$;
  readonly brandArray: string[] = Object.values(Brands);

  chooseSize(chosenSize: number): void {
    this.currFilters$
      .pipe(
        take(1),
        tap((f) => {
          if (f.size === chosenSize) {
            this.shoeService.updateFilter({ size: undefined });
          } else {
            this.shoeService.updateFilter({ size: chosenSize });
          }
        }),
      )
      .subscribe();
  }

  form: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private shoeService: shoeItemService,
    private itemQuery: ShoeItemQuery,
  ) {
    this.form = this.fb.group({
      all: new FormControl(true),
      selectedBrands: this.fb.array(
        this.brandArray.map(() => new FormControl(true)),
      ),
    });
  }

  get selectedBrands(): FormArray {
    return this.form.get('selectedBrands') as FormArray;
  }

  markCheckBox(): void {
    if (!this.form.get('all')?.value) {
      this.selectedBrands.controls.forEach((ctrl) =>
        ctrl.setValue(true, { emitEvent: false }),
      );
    } else {
      this.selectedBrands.controls.forEach((ctrl) =>
        ctrl.setValue(false, { emitEvent: false }),
      );
    }
  }

  //   FORM → STORE
  private subscribeToFormChanges(): void {
    this.form.valueChanges
      .pipe(
        distinctUntilChanged((prev, curr) => {
          const prevBrands = prev.selectedBrands as boolean[];
          const curBrands = curr.selectedBrands as boolean[];
          const equals = arraysEqual(prevBrands, curBrands);
          return prev.all === curr.all && equals;
        }),
        tap((formVal) => {
          const allChecked = formVal.all as boolean;
          const brandsArray = formVal.selectedBrands as boolean[];
          if (allChecked && brandsArray.includes(false)) {
            this.form.get('all')?.patchValue(false, { emitEvent: false });
          }
        }),
        tap(() => this.syncFormToStore()),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private syncFormToStore(): void {
    const allChecked = this.form.get('all')?.value;
    const selected = this.selectedBrands.value
      .map((checked: boolean, i: number) =>
        checked ? this.brandArray[i] : null,
      )
      .filter((v: string | null) => v !== null) as string[];

    const brandsToStore = allChecked
      ? undefined
      : selected.length
        ? selected
        : [];
    this.shoeService.updateFilter({ brands: brandsToStore });
  }

  // STORE → FORM
  private subscribeToStoreChanges(): void {
    this.itemQuery
      .select((state) => state.stateFilters.brands)
      .pipe(
        distinctUntilChanged((prev, curr) => arraysEqual(prev, curr)),
        tap((brands) => this.patchFormFromStore(brands)),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private patchFormFromStore(brands: string[] | undefined): void {
    const allChecked = !brands;

    this.form.get('all')?.patchValue(allChecked, { emitEvent: false });

    const newValues = this.brandArray.map((brand) =>
      allChecked ? true : (brands?.includes(brand) ?? false),
    );

    this.selectedBrands.controls.forEach((ctrl, i) => {
      ctrl.patchValue(newValues[i], { emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.subscribeToFormChanges();
    this.subscribeToStoreChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

function arraysEqual<T>(a: T[] | undefined, b: T[] | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
