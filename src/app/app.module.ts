import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AgGridModule } from 'ag-grid-angular';
import { ViewXmlComponent } from './view-xml/view-xml.component';
import { RendererComponent } from './renderer/renderer.component';

import { MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonToggleModule, MatMenuModule, MatStepperModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { FormsModule } from '@angular/forms';

@NgModule({
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatStepperModule
  ],
  declarations: [
    AppComponent,
    TableComponent,
    ViewXmlComponent,
    RendererComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule.withComponents([ RendererComponent ]), //The withComponents call is necessary for the grid to be able to use Angular components as cells / headers
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatStepperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
