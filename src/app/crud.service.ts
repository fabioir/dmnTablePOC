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

  ngOnInit() {
    console.log("crudInit");
    this.currentDMN = this.dataService.dmn;
    this.dmnSubscription = this.dataService.getDMNUpdates().subscribe(dmn => {
      this.currentDMN = dmn;
    });
  }

  ngOnDestroy() {
    this.dmnSubscription.unsubscribe();
  }

  createRow() {

    //create a dmn:DecisionRule
    //Fill with newly created inputEntries dmn:UnaryTests and outputEntries dmn:LiteralExpression
    if (!this.currentDMN.drgElements[0].decisionTable.rule) {
      let aux: any = this.currentDMN.drgElements[0].decisionTable;
      aux.set('rule', []);
    }
    //console.log(this.currentDMN.drgElements[0].decisionTable);
    this.currentDMN.drgElements[0].decisionTable.rule.push(this.dmnService.newRule());
    const rulesNumber = this.currentDMN.drgElements[0].decisionTable.rule.length;
    //console.log('number of rules: ' + rulesNumber);

    //Set the new rule id
    const newRule: _.DecisionRule = this.currentDMN.drgElements[0].decisionTable.rule[rulesNumber - 1];
    newRule.id = `rule${rulesNumber}`;

    newRule.inputEntry = this.dmnService.generateRuleInputEntries(newRule.id);
    newRule.outputEntry = this.dmnService.generateRuleOutputEntries(newRule.id);

    this.dataService.setDMN(this.currentDMN);
  }

  updateRow(rowIndex: number, columnIndex: number, newValue: string) {
    console.log("CRUD Update Row");
    const rule = this.dataService.dmn.drgElements[0].decisionTable.rule[rowIndex];
    if (rule.inputEntry.length >= columnIndex) {
      //It is an input value
      const previousValue = rule.inputEntry[columnIndex - 1].text;
      if (previousValue === newValue) {
        console.log("Entered the same value");
        //This return makes possible using tab to navigate across the table without refreshing it
        return;
      } else {
        rule.inputEntry[columnIndex - 1].text = newValue;
        //Updating current DMN
        this.currentDMN.drgElements[0].decisionTable.rule[rowIndex].inputEntry[columnIndex - 1].text = newValue;
        console.log("Input Updated");
        console.log(this.currentDMN);
      }
    } else {
      //It is an output value
      const previousValue = rule.outputEntry[columnIndex - 1 - rule.inputEntry.length].text;
      if (previousValue === newValue) {
        console.log("Entered the same value");
        //This return makes possible using tab to navigate across the table without refreshing it
        return;
      } else {
        rule.outputEntry[columnIndex - 1 - rule.inputEntry.length].text = newValue;
        //Updating current DMN
        this.currentDMN.drgElements[0].decisionTable.rule[rowIndex].outputEntry[columnIndex - 1 - rule.inputEntry.length].text = newValue;
        console.log("Input Updated");

      }
    }
    this.dataService.setDMN(this.currentDMN);
  }

  deleteRow(rowIndex: number) {
    const newRules = new Array<_.DecisionRule>();
    let rules = this.currentDMN.drgElements[0].decisionTable.rule;

    for(let i=0; i<rules.length; i++){
      if(i !== rowIndex){
        newRules.push(rules[i]);
      }
    }

    this.currentDMN.drgElements[0].decisionTable.rule = newRules;

    this.dataService.setDMN(this.currentDMN);
  }

  createInput() { 
    //Needed to add to the table inputs
    const inputClause : _.InputClause = this.dmnService.newInput();
    //Needed to add to every rule inputs
    let inputEntry: _.UnaryTests;

    const inputNumber = this.currentDMN.drgElements[0].decisionTable.input.length + 1;

    inputClause.id = `input${inputNumber}`;
    inputClause.inputExpression.typeRef = _.QName.string;
    inputClause.inputExpression.id = `inputExpression${inputNumber}`;

    //We push the inputClause to the table inputs
    this.currentDMN.drgElements[0].decisionTable.input.push(inputClause);

    //We introduce a new input entry for each rule with its own id for each rule
    this.currentDMN.drgElements[0].decisionTable.rule.forEach(rule => {
      inputEntry = this.dmnService.newInputEntry();
      inputEntry.id = `${rule.id}input${inputNumber}`;
      rule.inputEntry.push(inputEntry);
    });
    
    this.dataService.setDMN(this.currentDMN);

  }

  updateInput() { }

  deleteInput(colNumber: number) { 
    console.log("deleting input column " + colNumber);

    const auxInputs = new Array<_.InputClause>();
    let inputs = this.currentDMN.drgElements[0].decisionTable.input;
    //Delete the input from the dec table
    for(let i=0; i<inputs.length; i++){
      if(i!==colNumber){
        auxInputs.push(inputs[i]);
      }
    }
    this.currentDMN.drgElements[0].decisionTable.input = auxInputs;

    //Now lets delete it from each rule
    this.currentDMN.drgElements[0].decisionTable.rule.forEach(rule => {
      const auxInputEntries = new Array<_.UnaryTests>();
      let inputEntries = rule.inputEntry;

      for(let i=0; i<inputEntries.length; i++){
        if(i !== colNumber){
          auxInputEntries.push(inputEntries[i]);
        }
      }
      rule.inputEntry = auxInputEntries;
    });

    this.dataService.setDMN(this.currentDMN);

    //reasign ids... May not be relevant ?
  }

  createOutput() {
    //Needed to add to the table outputs
    const outputClause: _.OutputClause = this.dmnService.newOutput();
    //Needed to add to each rule outputs
    let outputEntry: _.LiteralExpression;

    //Lets find out the output number
    const outputNumber = this.currentDMN.drgElements[0].decisionTable.output.length + 1;

    outputClause.id = `output${outputNumber}`;
    outputClause.typeRef = _.QName.string;

    //We push the Output Clause into the table outputs Array
    this.currentDMN.drgElements[0].decisionTable.output.push(outputClause);

    this.currentDMN.drgElements[0].decisionTable.rule.forEach(rule => {
      outputEntry = this.dmnService.newOutputEntry();
      outputEntry.id = `${rule.id}output${outputNumber}`;
      rule.outputEntry.push(outputEntry);
    });

    this.dataService.setDMN(this.currentDMN);
   }

  updateOutput() { }

  deleteOutput(colNumber: number) {
    console.log("deleting output column " + colNumber);

    const auxOutputs = new Array<_.OutputClause>();
    let outputs = this.currentDMN.drgElements[0].decisionTable.output;
    //Delete the input from the dec table
    for(let i=0; i<outputs.length; i++){
      if(i!==colNumber){
        auxOutputs.push(outputs[i]);
      }
    }
    this.currentDMN.drgElements[0].decisionTable.output = auxOutputs;

    //Now lets delete it from each rule
    this.currentDMN.drgElements[0].decisionTable.rule.forEach(rule => {
      const auxOutputEntries = new Array<_.LiteralExpression>();
      let outputEntries = rule.outputEntry;

      for(let i=0; i<outputEntries.length; i++){
        if(i !== colNumber){
          auxOutputEntries.push(outputEntries[i]);
        }
      }
      rule.outputEntry = auxOutputEntries;
    });

    //reasign ids... May not be relevant ?
    
    this.dataService.setDMN(this.currentDMN);

   }

  /**
   * Updates the Hit Policy in the DMN.
   * @param newHitPolicy String specifying the new Hit Policy
   */
  updateHitPolicy(newHitPolicy: string) {
    this.currentDMN.drgElements[0].decisionTable.hitPolicy = <HitPolicy>newHitPolicy;
    this.dataService.setDMN(this.currentDMN);
  }


}
