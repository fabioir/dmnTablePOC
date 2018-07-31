import { Component, OnInit } from '@angular/core';

import {IHeaderGroupParams} from "ag-grid/main";
import {IHeaderGroupAngularComp} from "ag-grid-angular/main";

@Component({
  selector: 'app-header-outputs-group',
  templateUrl: './header-outputs-group.component.html',
  styleUrls: ['./header-outputs-group.component.css']
})
export class HeaderOutputsGroupComponent implements OnInit, IHeaderGroupAngularComp {

  public params: IHeaderGroupParams;

  constructor() { }

  ngOnInit() {
  }

  agInit(params: IHeaderGroupParams){
    this.params = params;
    //console.log(params);
  } 
 
  newOutput(){
    console.log("New output");
    //this.tableComponent.addInput();
  }

}
