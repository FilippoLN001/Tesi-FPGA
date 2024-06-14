import { Component, OnInit, OnDestroy } from '@angular/core';
import { saveAs } from 'file-saver';

interface CheckboxState {
  active: boolean;
  negated: boolean;
}

interface TableRow {
  id: number;
  input: number;
  inputType: 'Input' | 'Pulser';
  sampled: boolean;
  edgeDetect: boolean;
  edge: boolean;
  frequency: number;
  duty: number;
  polarity: boolean;
  silentTime: number;
  silentTimeUnit: 'ms' | 'us' | 'ns';
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
    id: index + 1,
    input: 0,
    inputType: 'Input',
    sampled: true,
    edgeDetect: true,
    edge: true,
    frequency: 0,
    duty: 0,
    polarity: true,
    silentTime: 0,
    silentTimeUnit: 'ms',
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
      // Assicuriamoci che tutte le proprietà siano definite quando l'inputType cambia
      if (inputType === 'Input') {
        this.rows[this.selectedInputIndex].sampled = true;
        this.rows[this.selectedInputIndex].edgeDetect = true;
        this.rows[this.selectedInputIndex].edge = true;
      } else if (inputType === 'Pulser') {
        this.rows[this.selectedInputIndex].frequency = 0;
        this.rows[this.selectedInputIndex].duty = 0;
        this.rows[this.selectedInputIndex].polarity = true;
      }
    }
  }

  updatePulserOptions(event: { frequency: number, duty: number, polarity: boolean }) {
    if (this.selectedInputIndex !== null) {
      this.rows[this.selectedInputIndex].frequency = event.frequency;
      this.rows[this.selectedInputIndex].duty = event.duty;
      this.rows[this.selectedInputIndex].polarity = event.polarity;
    }
  }

  updateSilentTime(event: { silentTime: number, silentTimeUnit: 'ms' | 'us' | 'ns' }) {
    if (this.selectedInputIndex !== null) {
      this.rows[this.selectedInputIndex].silentTime = event.silentTime;
      this.rows[this.selectedInputIndex].silentTimeUnit = event.silentTimeUnit;
    } else if (this.selectedOutputIndex !== null) {
      this.rows[this.selectedOutputIndex].silentTime = event.silentTime;
      this.rows[this.selectedOutputIndex].silentTimeUnit = event.silentTimeUnit;
    }
  }

  updateOutputNegated(negated: boolean) {
    if (this.selectedOutputIndex !== null) {
      this.rows[this.selectedOutputIndex]['outputNegated'] = negated;
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
        id: row.id,
        input: row.input,
        inputType: row.inputType,
        silentTime: row.silentTime,
        silentTimeUnit: row.silentTimeUnit,
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
