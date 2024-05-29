import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cell-input',
  templateUrl: './cell-input.component.html',
  styleUrls: ['./cell-input.component.css']
})
export class CellInputComponent {
  @Input() inputValue!: number;
  @Input() inputType!: 'Input' | 'Pulser';
  @Output() updateInputType = new EventEmitter<'Input' | 'Pulser'>();

  // Stato per l'opzione 'Input'
  sampled: boolean = false;
  edgeDetect: boolean = false;
  edge: boolean = false;

  // Stato per l'opzione 'Pulser'
  frequency: number = 0;
  duty: number = 0;
  polarity: boolean = false;

  onInputTypeChange(inputType: 'Input' | 'Pulser') {
    this.updateInputType.emit(inputType);
  }

  // Emette gli stati delle variabili booleane per l'opzione 'Input'
  onInputOptionChange() {
    console.log('Input Options:', { sampled: this.sampled, edgeDetect: this.edgeDetect, edge: this.edge });
  }

  // Emette gli stati delle variabili per l'opzione 'Pulser'
  onPulserOptionChange() {
    console.log('Pulser Options:', { frequency: this.frequency, duty: this.duty, polarity: this.polarity });
  }
}
