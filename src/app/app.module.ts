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
import { HeaderInputComponent } from './header-input/header-input.component';
import { HeaderOutputComponent } from './header-output/header-output.component';
import { HeaderOutputsGroupComponent } from './header-outputs-group/header-outputs-group.component';
import { HeaderInputsGroupComponent } from './header-inputs-group/header-inputs-group.component';
import { HeaderHitComponent } from './header-hit/header-hit.component';
import { HeaderInformationItemGroupComponent } from './header-information-item-group/header-information-item-group.component';

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
    RendererComponent,
    HeaderInputComponent,
    HeaderOutputComponent,
    HeaderOutputsGroupComponent,
    HeaderInputsGroupComponent,
    HeaderHitComponent,
    HeaderInformationItemGroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule.withComponents([ RendererComponent, HeaderInputComponent, HeaderOutputComponent, HeaderOutputsGroupComponent, HeaderInputsGroupComponent, HeaderHitComponent, HeaderInformationItemGroupComponent ]), //The withComponents call is necessary for the grid to be able to use Angular components as cells / headers
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
