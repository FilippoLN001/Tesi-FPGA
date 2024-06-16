import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cell-output',
  templateUrl: './cell-output.component.html',
  styleUrls: ['./cell-output.component.css']
})
export class CellOutputComponent implements OnInit, OnChanges {
  @Input() outputNegated!: boolean;
  @Input() silentTime!: number;
  @Input() silentTimeUnit!: 'ms' | 'us' | 'ns';
  @Output() updateOutputNegated = new EventEmitter<boolean>();
  @Output() updateSilentTime = new EventEmitter<{ silentTime: number, silentTimeUnit: 'ms' | 'us' | 'ns' }>();

  ngOnInit() {
    this.setDefaults();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['outputNegated']) {
      this.setDefaults();
    }
  }

  setDefaults() {
    this.silentTime = this.silentTime || 0;
    this.silentTimeUnit = this.silentTimeUnit || 'ms';
  }

  onOutputNegatedChange() {
    this.updateOutputNegated.emit(this.outputNegated);
  }

  onSilentTimeChange() {
    this.updateSilentTime.emit({
      silentTime: this.silentTime,
      silentTimeUnit: this.silentTimeUnit
    });
  }

  onSilentTimeUnitChange(unit: 'ms' | 'us' | 'ns') {
    this.silentTimeUnit = unit;
    this.onSilentTimeChange();
  }
}
