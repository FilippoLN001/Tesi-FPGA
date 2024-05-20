import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cell-check',
  templateUrl: './cell-check.component.html',
  styleUrls: ['./cell-check.component.css']
})
export class CellCheckComponent {
  @Input() column: 'and1' | 'or' | 'and2' | undefined; // Colonna della checkbox
  @Input() index: number | undefined; // Indice della riga
  @Input() selectedStates: number[] = []; // Stati selezionati delle checkbox
  @Output() update = new EventEmitter<any>(); // Evento di aggiornamento
  values: number[] = [];

  ngOnInit() {
    this.values = [...this.selectedStates]; // Inizializza i valori con gli stati selezionati
  }

  ngOnChanges() {
    this.values = [...this.selectedStates]; // Aggiorna i valori quando gli stati cambiano
  }

  toggleValue(i: number) {
    if (this.values.includes(i)) {
      this.values = this.values.filter(v => v !== i); // Rimuove il valore se già presente
    } else {
      this.values.push(i); // Aggiunge il valore se non presente
    }
    this.update.emit({ column: this.column, index: this.index, values: this.values }); // Emette l'evento di aggiornamento
  }
}
