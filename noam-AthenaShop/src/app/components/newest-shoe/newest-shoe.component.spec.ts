import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewestShoeComponent } from './newest-shoe.component';

describe('NewestShoeComponent', () => {
  let component: NewestShoeComponent;
  let fixture: ComponentFixture<NewestShoeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewestShoeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewestShoeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
