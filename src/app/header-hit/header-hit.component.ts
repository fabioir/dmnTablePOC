import { Component, OnInit } from '@angular/core';

import {IHeaderParams} from "ag-grid/main";
import {IHeaderAngularComp} from "ag-grid-angular/main";

import { HitPolicy, ReverseHitPolicy, Definitions } from '../metamodel-classes/metamodelClasses';

import { DataService } from '../data.service';

@Component({
  selector: 'app-header-hit',
  templateUrl: './header-hit.component.html',
  styleUrls: ['./header-hit.component.css']
})
export class HeaderHitComponent implements OnInit, IHeaderAngularComp {

  public params: IHeaderParams;
  public dmn: Definitions;

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  agInit(params: IHeaderParams){
    this.params = params;
  }

  setHitPolicy(policy: string){
    console.log(policy);
    console.log(ReverseHitPolicy[policy]);
    const reverse = ReverseHitPolicy[policy];
    this.dmn = this.dataService.dmn;
    this.dmn.drgElements[0].decisionTable.hitPolicy = <HitPolicy>policy;

    this.dataService.setDMN(this.dmn);
  }

}
