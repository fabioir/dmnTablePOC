import { Component, OnInit } from '@angular/core';

import {IHeaderGroupParams} from "ag-grid/main";
import {IHeaderGroupAngularComp} from "ag-grid-angular/main";

import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-header-inputs-group',
  templateUrl: './header-inputs-group.component.html',
  styleUrls: ['./header-inputs-group.component.css']
})
export class HeaderInputsGroupComponent implements OnInit, IHeaderGroupAngularComp {

  public params: IHeaderGroupParams;

  constructor(
    //private tableComponent: TableComponent
  ) { }

  ngOnInit() {
  }

  agInit(params: IHeaderGroupParams){
    this.params = params;
    console.log(params);
  }

  newInput(){
    console.log("New input");
    //this.tableComponent.addInput();
  }

}
