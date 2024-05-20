import { Component, OnInit, OnDestroy } from '@angular/core';

// Interfaccia per definire la struttura di una riga della tabella
interface TableRow {
  input: number; 
  and1: string;
  or: string;
  and2: string;
  output: string;
  and1CheckboxStates: number[];
  orCheckboxStates: number[];
  and2CheckboxStates: number[];
  inputType: 'Input' | 'Pulser' | ''; 
}

// Tipo per le colonne delle checkbox
type CheckboxColumn = 'and1CheckboxStates' | 'orCheckboxStates' | 'and2CheckboxStates';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
  title = 'Tabella Interattiva'; // Titolo del componente
  rows: TableRow[] = Array(8).fill(0).map(() => ({
    input: 0, // Inizializza il contatore a 0
    and1: '',
    or: '',
    and2: '',
    output: '',
    and1CheckboxStates: [],
    orCheckboxStates: [],
    and2CheckboxStates: [],
    inputType: '' // Inizializza inputType come vuoto
  })); // Inizializza 8 righe con valori vuoti

  selectedInputIndex: number | null = null; // Indice dell'input selezionato
  selectedCheckColumn: 'and1' | 'or' | 'and2' | null = null; // Colonna delle checkbox selezionata
  selectedCheckIndex: number | null = null; // Indice della checkbox selezionata
  intervalId: ReturnType<typeof setInterval> | null = null; // ID dell'intervallo per il contatore

  ngOnInit() {
    this.startCounters(); // Avvia i contatori all'inizio
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Pulisci l'intervallo quando il componente viene distrutto
    }
  }

  // Avvia i contatori per ogni riga
  startCounters() {
    this.intervalId = setInterval(() => {
      this.rows.forEach(row => {
        row.input += 1; // Incrementa il contatore di 1
      });
    }, 1000); // Aggiorna ogni secondo
  }

  // Mostra il componente di input per la cella selezionata
  showInputComponent(index: number) {
    this.selectedInputIndex = index;
    this.selectedCheckColumn = null;
    this.selectedCheckIndex = null;
  }

  // Mostra il componente di checkbox per la cella selezionata
  showCheckComponent(column: 'and1' | 'or' | 'and2', index: number) {
    this.selectedInputIndex = null;
    this.selectedCheckColumn = column;
    this.selectedCheckIndex = index;
  }

  // Mostra il componente di output per la cella selezionata
  showOutputComponent(index: number) {
    this.selectedInputIndex = null;
    this.selectedCheckColumn = null;
    this.selectedCheckIndex = index;
  }

  // Aggiorna gli stati delle checkbox per la cella selezionata
  updateNumbers(event: { column: 'and1' | 'or' | 'and2', index: number, values: number[] }) {
    const { column, index, values } = event;
    const checkboxColumn: CheckboxColumn = `${column}CheckboxStates` as CheckboxColumn;
    this.rows[index][checkboxColumn] = values;
  }

  // Aggiorna il tipo di input per la cella selezionata
  updateInputType(index: number, inputType: 'Input' | 'Pulser') {
    this.rows[index].inputType = inputType;
  }

  // Restituisce i numeri selezionati come stringa per la colonna specificata
  getNumbers(column: 'and1' | 'or' | 'and2', index: number): string {
    const checkboxColumn: CheckboxColumn = `${column}CheckboxStates` as CheckboxColumn;
    return this.rows[index][checkboxColumn].join(', ');
  }

  // Restituisce gli stati delle checkbox per la colonna e riga specificata
  getCheckboxStates(column: 'and1' | 'or' | 'and2', index: number): number[] {
    const checkboxColumn: CheckboxColumn = `${column}CheckboxStates` as CheckboxColumn;
    return this.rows[index][checkboxColumn];
  }
}
