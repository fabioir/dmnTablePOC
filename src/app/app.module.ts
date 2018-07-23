import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AgGridModule } from 'ag-grid-angular';;

@NgModule({
  declarations: [
    AppComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule.withComponents([]), //The withComponents call is necessary for the grid to be able to use Angular components as cells / headers
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
