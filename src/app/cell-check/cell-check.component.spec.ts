import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellCheckComponent } from './cell-check.component';

describe('CellCheckComponent', () => {
  let component: CellCheckComponent;
  let fixture: ComponentFixture<CellCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellCheckComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CellCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
