import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnexionCaisComponent } from './connexion-cais.component';

describe('ConnexionCaisComponent', () => {
  let component: ConnexionCaisComponent;
  let fixture: ComponentFixture<ConnexionCaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnexionCaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnexionCaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
