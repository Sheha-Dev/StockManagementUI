import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockRequestFormComponent } from './stock-request-form-component';

describe('StockRequestFormComponent', () => {
  let component: StockRequestFormComponent;
  let fixture: ComponentFixture<StockRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockRequestFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StockRequestFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
