import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { CellInputComponent } from './cell-input/cell-input.component';
import { CellCheckComponent } from './cell-check/cell-check.component';
import { AppRoutingModule } from './app.routes';  // Importa il modulo di routing
import { CellOutputComponent } from './cell-output/cell-output.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    CellInputComponent,
    CellCheckComponent,
    CellOutputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule  // Aggiungi il modulo di routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
