import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellOutputComponent } from './cell-output.component';

describe('CellOutputComponent', () => {
  let component: CellOutputComponent;
  let fixture: ComponentFixture<CellOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellOutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CellOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
