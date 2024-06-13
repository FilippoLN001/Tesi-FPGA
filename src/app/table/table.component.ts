import { Component, OnInit, OnDestroy } from '@angular/core';
import { saveAs } from 'file-saver';

interface CheckboxState {
  active: boolean;
  negated: boolean;
}

interface TableRow {
  id: number;  // Aggiungiamo questa proprietà
  input: number;
  inputUnit: 'ms' | 'us' | 'ns';
  inputType: 'Input' | 'Pulser';
  sampled?: boolean;
  edgeDetect?: boolean;
  edge?: boolean;
  frequency?: number;
  duty?: number;
  polarity?: boolean;
  and1: string;
  or: string;
  and2: string;
  output: number;
  outputUnit: 'ms' | 'us' | 'ns';
  outputNegated: boolean;
  and1CheckboxStates: CheckboxState[];
  orCheckboxStates: CheckboxState[];
  and2CheckboxStates: CheckboxState[];
}

type CheckboxColumn = 'and1CheckboxStates' | 'orCheckboxStates' | 'and2CheckboxStates';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
  title = 'Tabella Interattiva';
  rows: TableRow[] = Array(8).fill(0).map((_, index) => ({
    id: index + 1,  // Assegniamo un ID univoco a ciascuna riga
    input: 0,
    inputUnit: 'ms',
    inputType: 'Input',
    sampled: true,
    edgeDetect: true,
    edge: true,
    and1: '',
    or: '',
    and2: '',
    output: 0,
    outputUnit: 'ms',
    outputNegated: false,
    and1CheckboxStates: Array(8).fill(0).map(() => ({ active: false, negated: false })),
    orCheckboxStates: Array(8).fill(0).map(() => ({ active: false, negated: false })),
    and2CheckboxStates: Array(8).fill(0).map(() => ({ active: false, negated: false }))
  }));

  selectedInputIndex: number | null = null;
  selectedCheckColumn: 'and1' | 'or' | 'and2' | null = null;
  selectedCheckIndex: number | null = null;
  selectedOutputIndex: number | null = null;
  intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.startCounters();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startCounters() {
    this.intervalId = setInterval(() => {
      this.rows.forEach(row => {
        row.input += 1;
        row.output += 1;
      });
    }, 1000);
  }

  showInputComponent(index: number) {
    this.selectedInputIndex = index;
    this.selectedCheckColumn = null;
    this.selectedCheckIndex = null;
    this.selectedOutputIndex = null;
  }

  showCheckComponent(column: 'and1' | 'or' | 'and2', index: number) {
    this.selectedInputIndex = null;
    this.selectedCheckColumn = column;
    this.selectedCheckIndex = index;
    this.selectedOutputIndex = null;
  }

  showOutputComponent(index: number) {
    this.selectedInputIndex = null;
    this.selectedCheckColumn = null;
    this.selectedCheckIndex = null;
    this.selectedOutputIndex = index;
  }

  updateNumbers(event: { column: 'and1' | 'or' | 'and2', index: number, values: CheckboxState[] }) {
    const { column, index, values } = event;
    const checkboxColumn: CheckboxColumn = `${column}CheckboxStates` as CheckboxColumn;
    this.rows[index][checkboxColumn] = values;
  }

  updateInputType(inputType: 'Input' | 'Pulser') {
    if (this.selectedInputIndex !== null) {
      this.rows[this.selectedInputIndex]['inputType'] = inputType;
    }
  }

  updateOutputNegated(negated: boolean) {
    if (this.selectedOutputIndex !== null) {
      this.rows[this.selectedOutputIndex]['outputNegated'] = negated;
    }
  }

  updateInputUnit(unit: 'ms' | 'us' | 'ns') {
    if (this.selectedInputIndex !== null) {
      this.rows[this.selectedInputIndex]['inputUnit'] = unit;
    }
  }

  updateOutputUnit(unit: 'ms' | 'us' | 'ns') {
    if (this.selectedOutputIndex !== null) {
      this.rows[this.selectedOutputIndex]['outputUnit'] = unit;
    }
  }

  getNumbers(column: 'and1' | 'or' | 'and2', index: number): string {
    const checkboxColumn: CheckboxColumn = `${column}CheckboxStates` as CheckboxColumn;
    return this.rows[index][checkboxColumn]
      .map((state, i) => (state.active ? (i + 1).toString() : ''))
      .filter(num => num !== '')
      .join(', ');
  }

  getCheckboxStates(column: 'and1' | 'or' | 'and2', index: number): CheckboxState[] {
    const checkboxColumn: CheckboxColumn = `${column}CheckboxStates` as CheckboxColumn;
    return this.rows[index][checkboxColumn];
  }

  generateJsonFile() {
    const jsonRows = this.rows.map(row => {
      const rowData: any = {
        id: row.id,  // Includiamo l'ID nel file JSON
        input: row.input,
        inputUnit: row.inputUnit,
        inputType: row.inputType,
        output: row.output,
        outputUnit: row.outputUnit,
        outputNegated: row.outputNegated,
        and1CheckboxStates: row.and1CheckboxStates.map((state, index) => ({
          number: index + 1,
          active: state.active,
          negated: state.negated
        })),
        orCheckboxStates: row.orCheckboxStates.map((state, index) => ({
          number: index + 1,
          active: state.active,
          negated: state.negated
        })),
        and2CheckboxStates: row.and2CheckboxStates.map((state, index) => ({
          number: index + 1,
          active: state.active,
          negated: state.negated
        })),
      };

      if (row.inputType === 'Input') {
        rowData.sampled = row.sampled;
        rowData.edgeDetect = row.edgeDetect;
        rowData.edge = row.edge;
      } else if (row.inputType === 'Pulser') {
        rowData.frequency = row.frequency;
        rowData.duty = row.duty;
        rowData.polarity = row.polarity;
      }

      return rowData;
    });

    const json = JSON.stringify(jsonRows, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'table-data.json');
  }
}
