import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cell-output',
  templateUrl: './cell-output.component.html',
  styleUrls: ['./cell-output.component.css']
})
export class CellOutputComponent {
  @Input() outputNegated!: boolean;
  @Output() updateOutputNegated = new EventEmitter<boolean>();

  onOutputNegatedChange(negated: boolean) {
    this.updateOutputNegated.emit(negated);
  }
}
