import { Injectable, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import * as _ from './metamodel-classes/metamodelClasses';

import { DataService } from './data.service';
import { DmnService } from './dmn.service';

import { Definitions, HitPolicy } from './metamodel-classes/metamodelClasses';

@Injectable({
  providedIn: 'root'
})
export class CrudService implements OnInit, OnDestroy {

  dmnSubscription: Subscription;
  currentDMN: Definitions;

  constructor(
    private dataService: DataService,
    private dmnService: DmnService
  ) { }

  ngOnInit(){
    console.log("crudInit");
    this.currentDMN = this.dataService.dmn;
    this.dmnSubscription = this.dataService.getDMNUpdates().subscribe(dmn => {
      this.currentDMN = dmn;
    });
  }

  ngOnDestroy(){
    this.dmnSubscription.unsubscribe();
  }

  createRow(){
    
    //create a dmn:DecisionRule
    //Fill with newly created inputEntries dmn:UnaryTests and outputEntries dmn:LiteralExpression
    if(!this.currentDMN.drgElements[0].decisionTable.rule){
     let aux: any = this.currentDMN.drgElements[0].decisionTable;
     aux.set('rule', []);
    }
    console.log(this.currentDMN.drgElements[0].decisionTable);
    this.currentDMN.drgElements[0].decisionTable.rule.push(this.dmnService.newRule());
    const rulesNumber = this.currentDMN.drgElements[0].decisionTable.rule.length;
    console.log('number of rules: ' + rulesNumber);

    //Set the new rule id
    const newRule: _.DecisionRule = this.currentDMN.drgElements[0].decisionTable.rule[rulesNumber-1];
    newRule.id = `rule${rulesNumber}`;

    newRule.inputEntry = this.dmnService.generateRuleInputEntries(newRule.id);
    newRule.outputEntry = this.dmnService.generateRuleOutputEntries(newRule.id);

    this.dataService.setDMN(this.currentDMN);
  }

  updateRow(){}

  deleteRow(){}

  createInput(){}

  updateInput(){}

  deleteInput(){}

  createOutput(){}

  updateOutput(){}

  deleteOutput(){}

  /**
   * Updates the Hit Policy in the DMN.
   * @param newHitPolicy String specifying the new Hit Policy
   */
  updateHitPolicy(newHitPolicy: string){
    this.currentDMN.drgElements[0].decisionTable.hitPolicy = <HitPolicy> newHitPolicy;
    this.dataService.setDMN(this.currentDMN);
  }
}
