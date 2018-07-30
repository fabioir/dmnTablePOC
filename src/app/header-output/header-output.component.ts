import { Component, OnInit } from '@angular/core';

import {IHeaderParams} from "ag-grid/main";
import {IHeaderAngularComp} from "ag-grid-angular/main";

@Component({
  selector: 'app-header-output',
  templateUrl: './header-output.component.html',
  styleUrls: ['./header-output.component.css']
})
export class HeaderOutputComponent implements OnInit, IHeaderAngularComp {

  params: IHeaderParams;

  constructor() { }

  ngOnInit() {
  }

  agInit(params: IHeaderParams){
    this.params = params;
    console.log(params);
  }

  editOutput(){
    console.log("This should deploy output edit options");
  }

}
