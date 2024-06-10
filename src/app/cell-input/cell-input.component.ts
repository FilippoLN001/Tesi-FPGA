import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cell-input',
  templateUrl: './cell-input.component.html',
  styleUrls: ['./cell-input.component.css']
})
export class CellInputComponent implements OnInit, OnChanges {
  @Input() inputValue!: number;
  @Input() inputType!: 'Input' | 'Pulser';
  @Output() updateInputType = new EventEmitter<'Input' | 'Pulser'>();

  sampled: boolean = true;
  edgeDetect: boolean = true;
  edge: boolean = true;

  frequency: number = 0;
  duty: number = 0;
  polarity: boolean = false;

  ngOnInit() {
    this.setDefaults();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputType'] && changes['inputType'].currentValue === 'Input') {
      this.setDefaults();
    }
  }

  setDefaults() {
    if (this.inputType === 'Input') {
      this.sampled = true;
      this.edgeDetect = true;
      this.edge = true;
    }
  }

  onInputTypeChange(inputType: 'Input' | 'Pulser') {
    this.updateInputType.emit(inputType);
    if (inputType === 'Input') {
      this.setDefaults();
    }
    if (inputType=== 'Pulser'){
      this.polarity=true
    }
  }

  onInputOptionChange() {
    console.log('Input Options:', { sampled: this.sampled, edgeDetect: this.edgeDetect, edge: this.edge });
  }

  onPulserOptionChange() {
    console.log('Pulser Options:', { frequency: this.frequency, duty: this.duty, polarity: this.polarity });
  }
}
