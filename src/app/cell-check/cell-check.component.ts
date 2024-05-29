import { Component, Input, Output, EventEmitter } from '@angular/core';

interface CheckboxState {
  active: boolean;
  negated: boolean;
}

@Component({
  selector: 'app-cell-check',
  templateUrl: './cell-check.component.html',
  styleUrls: ['./cell-check.component.css']
})
export class CellCheckComponent {
  @Input() column!: 'and1' | 'or' | 'and2';
  @Input() index!: number;
  @Input() selectedStates: CheckboxState[] = [];
  @Output() update = new EventEmitter<{ column: 'and1' | 'or' | 'and2', index: number, values: CheckboxState[] }>();

  toggleActive(i: number) {
    const updatedStates = [...this.selectedStates];
    updatedStates[i] = { ...updatedStates[i], active: !updatedStates[i].active };
    this.update.emit({ column: this.column, index: this.index, values: updatedStates });
  }

  toggleNegated(i: number) {
    const updatedStates = [...this.selectedStates];
    updatedStates[i] = { ...updatedStates[i], negated: !updatedStates[i].negated };
    this.update.emit({ column: this.column, index: this.index, values: updatedStates });
  }
}
