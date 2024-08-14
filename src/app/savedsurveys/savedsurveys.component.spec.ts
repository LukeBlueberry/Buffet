import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedsurveysComponent } from './savedsurveys.component';

describe('SavedsurveysComponent', () => {
  let component: SavedsurveysComponent;
  let fixture: ComponentFixture<SavedsurveysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedsurveysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedsurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
