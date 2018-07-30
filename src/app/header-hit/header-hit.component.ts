import { Component, OnInit } from '@angular/core';

import {IHeaderParams} from "ag-grid/main";
import {IHeaderAngularComp} from "ag-grid-angular/main";

@Component({
  selector: 'app-header-hit',
  templateUrl: './header-hit.component.html',
  styleUrls: ['./header-hit.component.css']
})
export class HeaderHitComponent implements OnInit, IHeaderAngularComp {

  public params: IHeaderParams;

  constructor() { }

  ngOnInit() {
  }

  agInit(params: IHeaderParams){
    this.params = params;
  }

  setPolicy(){
    console.log("Here we should set the new HIT policy");
  }

}
