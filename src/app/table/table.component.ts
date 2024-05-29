import { Component, OnInit, OnDestroy } from '@angular/core';

interface CheckboxState {
  active: boolean;
  negated: boolean;
}

interface TableRow {
  input: number;
  inputType: 'Input' | 'Pulser';
  and1: string;
  or: string;
  and2: string;
  output: number;
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
  rows: TableRow[] = Array(8).fill(0).map(() => ({
    input: 0,
    inputType: 'Input',
    and1: '',
    or: '',
    and2: '',
    output: 0,
    and1CheckboxStates: Array(8).fill(0).map(() => ({ active: false, negated: false })),
    orCheckboxStates: Array(8).fill(0).map(() => ({ active: false, negated: false })),
    and2CheckboxStates: Array(8).fill(0).map(() => ({ active: false, negated: false }))
  }));

  selectedInputIndex: number | null = null;
  selectedCheckColumn: 'and1' | 'or' | 'and2' | null = null;
  selectedCheckIndex: number | null = null;
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
  }

  showCheckComponent(column: 'and1' | 'or' | 'and2', index: number) {
    this.selectedInputIndex = null;
    this.selectedCheckColumn = column;
    this.selectedCheckIndex = index;
  }

  showOutputComponent(index: number) {
    this.selectedInputIndex = null;
    this.selectedCheckColumn = null;
    this.selectedCheckIndex = index;
  }

  updateNumbers(event: { column: 'and1' | 'or' | 'and2', index: number, values: CheckboxState[] }) {
    const { column, index, values } = event;
    const checkboxColumn: CheckboxColumn = `${column}CheckboxStates` as CheckboxColumn;
    this.rows[index][checkboxColumn] = values;
  }

  updateInputType(inputType: 'Input' | 'Pulser') {
    if (this.selectedInputIndex !== null) {
      this.rows[this.selectedInputIndex].inputType = inputType;
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
}
