import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McurrencyComponent } from './mcurrency.component';

describe('McurrencyComponent', () => {
  let component: McurrencyComponent;
  let fixture: ComponentFixture<McurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McurrencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(McurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
