import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsComponent } from './gps.component';

describe('GpsComponent', () => {
  let component: GpsComponent;
  let fixture: ComponentFixture<GpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
