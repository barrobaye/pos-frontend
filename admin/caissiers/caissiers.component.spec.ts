import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaissiersComponent } from './caissiers.component';

describe('CaissiersComponent', () => {
  let component: CaissiersComponent;
  let fixture: ComponentFixture<CaissiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaissiersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaissiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
