import { Component, OnInit } from '@angular/core';

import {IHeaderGroupParams} from "ag-grid/main";
import {IHeaderGroupAngularComp} from "ag-grid-angular/main";

@Component({
  selector: 'app-header-information-item-group',
  templateUrl: './header-information-item-group.component.html',
  styleUrls: ['./header-information-item-group.component.css']
})
export class HeaderInformationItemGroupComponent implements OnInit, IHeaderGroupAngularComp {

  public params: IHeaderGroupParams;

  constructor() { }

  ngOnInit() {
  }

  agInit(params: IHeaderGroupParams){
    this.params = params;
  }

}
