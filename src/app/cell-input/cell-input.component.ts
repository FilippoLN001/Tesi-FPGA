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
  polarity: boolean = true; // Impostiamo polarity su true di default

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
    console.log('Pulser Options:', { frequency: this.frequency, duty: this.duty, polarity: this.polarity });
  }
}
