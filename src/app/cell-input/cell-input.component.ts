import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cell-input',
  templateUrl: './cell-input.component.html',
  styleUrls: ['./cell-input.component.css']
})
export class CellInputComponent {
  @Input() inputValue: string | undefined; // Riceve il valore dell'input dalla cella selezionata
  @Input() inputType: 'Input' | 'Pulser' | '' | undefined; // Riceve il tipo di input dalla cella selezionata
  @Output() updateInputType = new EventEmitter<'Input' | 'Pulser'>(); // Evento di aggiornamento

  // Emette l'evento di aggiornamento quando il tipo di input cambia
  onInputTypeChange(inputType: 'Input' | 'Pulser') {
    this.updateInputType.emit(inputType);
  }
}
