import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieMenuComponent } from './categorie-menu.component';

describe('CategorieMenuComponent', () => {
  let component: CategorieMenuComponent;
  let fixture: ComponentFixture<CategorieMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorieMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
