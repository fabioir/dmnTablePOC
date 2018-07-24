import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TableComponent } from './table/table.component';
import { ViewXmlComponent } from './view-xml/view-xml.component';

const routes: Routes = [
  { path: '', redirectTo: '/decisionTable', pathMatch: 'full' },
  { path: 'decisionTable', component: TableComponent },
  { path: 'viewXML', component: ViewXmlComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
