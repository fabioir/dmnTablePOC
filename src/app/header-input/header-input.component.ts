import { Component, OnInit } from '@angular/core';

import {IHeaderParams} from "ag-grid/main";
import {IHeaderAngularComp} from "ag-grid-angular/main";

@Component({
  selector: 'app-header-input',
  templateUrl: './header-input.component.html',
  styleUrls: ['./header-input.component.css']
})
export class HeaderInputComponent implements OnInit, IHeaderAngularComp {

  public params: IHeaderParams;


  constructor() { }

  ngOnInit() {
  }
  
  agInit(params: IHeaderParams){
    this.params = params;
    console.log(params);
  }

  editInput(){
    console.log("This should deploy input edit options");
  }

}
