import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrettyTableContainerComponent } from './pretty-table-container.component';

describe('PrettyTableContainerComponent', () => {
  let component: PrettyTableContainerComponent;
  let fixture: ComponentFixture<PrettyTableContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrettyTableContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrettyTableContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
