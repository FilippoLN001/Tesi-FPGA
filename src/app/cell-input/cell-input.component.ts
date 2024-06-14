import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cell-input',
  templateUrl: './cell-input.component.html',
  styleUrls: ['./cell-input.component.css']
})
export class CellInputComponent implements OnInit, OnChanges {
  @Input() inputValue!: number;
  @Input() inputType!: 'Input' | 'Pulser';
  @Input() sampled!: boolean;
  @Input() edgeDetect!: boolean;
  @Input() edge!: boolean;
  @Input() frequency!: number;
  @Input() duty!: number;
  @Input() polarity!: boolean;
  @Output() updateInputType = new EventEmitter<'Input' | 'Pulser'>();
  @Output() updatePulserOptions = new EventEmitter<{ frequency: number, duty: number, polarity: boolean }>();

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
    } else if (this.inputType === 'Pulser') {
      this.frequency = 0;
      this.duty = 0;
      this.polarity = true;
    }
  }

  onInputTypeChange(inputType: 'Input' | 'Pulser') {
    this.updateInputType.emit(inputType);
    if (inputType === 'Input') {
      this.setDefaults();
    } else if (inputType === 'Pulser') {
      this.polarity = true; // Impostiamo polarity su true quando si seleziona Pulser
    }
  }

  onInputOptionChange() {
    console.log('Input Options:', { sampled: this.sampled, edgeDetect: this.edgeDetect, edge: this.edge });
  }

  onPulserOptionChange() {
    this.updatePulserOptions.emit({
      frequency: this.frequency,
      duty: this.duty,
      polarity: this.polarity
    });
  }
}
