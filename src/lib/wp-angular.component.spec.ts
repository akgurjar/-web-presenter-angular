import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WpAngularComponent } from './wp-angular.component';

describe('WpAngularComponent', () => {
  let component: WpAngularComponent;
  let fixture: ComponentFixture<WpAngularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WpAngularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WpAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
