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
  inputSilentTime: number;
  inputSilentTimeUnit: 'ms' | 'us' | 'ns';
  and1CheckboxStates: CheckboxState[];
  orCheckboxStates: CheckboxState[];
  and2CheckboxStates: CheckboxState[];
  output: number;
  outputNegated: boolean;
  outputSilentTime: number;
  outputSilentTimeUnit: 'ms' | 'us' | 'ns';
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
    inputSilentTime: 0,
    inputSilentTimeUnit: 'ms',
    output: 0,
    outputNegated: false,
    outputSilentTime: 0,
    outputSilentTimeUnit: 'ms',
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

  updateInputType(event: { index: number, inputType: 'Input' | 'Pulser' }) {
    const { index, inputType } = event;
    this.rows[index].inputType = inputType;
  }

  updatePulserOptions(event: { index: number, frequency: number, duty: number, polarity: boolean }) {
    const { index, frequency, duty, polarity } = event;
    this.rows[index].frequency = frequency;
    this.rows[index].duty = duty;
    this.rows[index].polarity = polarity;
  }

  updateInputSilentTime(event: { index: number, silentTime: number, silentTimeUnit: 'ms' | 'us' | 'ns' }) {
    const { index, silentTime, silentTimeUnit } = event;
    this.rows[index].inputSilentTime = silentTime;
    this.rows[index].inputSilentTimeUnit = silentTimeUnit;
  }

  updateOutputSilentTime(event: { silentTime: number, silentTimeUnit: 'ms' | 'us' | 'ns' }) {
    if (this.selectedOutputIndex !== null) {
      this.rows[this.selectedOutputIndex].outputSilentTime = event.silentTime;
      this.rows[this.selectedOutputIndex].outputSilentTimeUnit = event.silentTimeUnit;
    }
  }
  

  updateInputOptions(event: { index: number, sampled: boolean, edgeDetect: boolean, edge: boolean }) {
    const { index, sampled, edgeDetect, edge } = event;
    this.rows[index].sampled = sampled;
    this.rows[index].edgeDetect = edgeDetect;
    this.rows[index].edge = edge;
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
        inputType: row.inputType,
        inputSilentTime: row.inputSilentTime,
        inputSilentTimeUnit: row.inputSilentTimeUnit,
        outputNegated: row.outputNegated,
        outputSilentTime: row.outputSilentTime,
        outputSilentTimeUnit: row.outputSilentTimeUnit,
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
