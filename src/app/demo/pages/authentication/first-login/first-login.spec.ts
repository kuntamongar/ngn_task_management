import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLogin } from './first-login';

describe('FirstLogin', () => {
  let component: FirstLogin;
  let fixture: ComponentFixture<FirstLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
