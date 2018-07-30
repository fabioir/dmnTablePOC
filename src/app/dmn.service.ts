import { Injectable, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';

import DmnModdle from 'dmn-moddle';
import * as _ from './metamodel-classes/metamodelClasses';
import { HttpClient } from '@angular/common/http'

import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class DmnService implements OnInit, OnDestroy {

  dmn: DmnModdle = new DmnModdle();
  currentDMN;
  currentDecisionTable: _.DecisionTable;
  currentDefinitions: _.Definitions;
  currentDMNUpdates = new Subject();
  currentXML; //updates when it does the DMN

  dmnUpdates: Subscription;
  xmlUpdates: Subscription;
  tableUpdates: Subscription;


  constructor(
    private http: HttpClient,
    private dataService: DataService
  ) { }

  /**
   * keeps the XML, Table and DMN updated respect to the data service
   */
  ngOnInit() {
    this.subscribeToChanges();
  }

  /**
   * Unsuscribes to the data service
   */
  ngOnDestroy() {
    this.dmnUpdates.unsubscribe();
    this.xmlUpdates.unsubscribe();
    this.tableUpdates.unsubscribe();
  }

  /**
   * Initial tasks common to every execution. Imports a default model
   */
  defaultStart() {
    this.subscribeToChanges();
    console.log("Default start");
    this.importXML('../../assets/default.dmn');
    console.log(this.dataService.xml);
    this.toDecisionTable(this.currentDMN);
  }

  /**
   * keeps the XML, Table and DMN updated respect to the data service
   */
  subscribeToChanges() {

    this.dmnUpdates = this.dataService.getDMNUpdates().subscribe(dmn => {
      if (dmn) {
        this.currentDMN = dmn;
        this.toDecisionTable(dmn);
      }
    });

    this.xmlUpdates = this.dataService.getXMLUpdates().subscribe(xml => {
      if (xml) {
        this.currentXML = xml;
      }
    });

    this.tableUpdates = this.dataService.getTableUpdates().subscribe(table => {
      if (table) {
        this.currentDecisionTable = table;
      }
    });

  }



  /**
   * Returns an Observable<DecisionTable> with the current decision table. (Not being used?)
   */
  getUpdates(): Observable<_.DecisionTable> {
    return <Observable<_.DecisionTable>>this.currentDMNUpdates.asObservable();
  }

  /**
   * 
   * @param url Local URL (assets) where the XML is
   * This function fetches and parses to DMN a XML file
   */
  importXML(url: string) {
    this.http.get(url, { responseType: 'text' }).subscribe(data => {
      this.dataService.setXML(data); //set current XML
      this.dmn.fromXML(data, 'dmn:Definitions', (err, response) => {
        this.currentDMN = response;
        if (err) {
          console.log(err);
        }
        console.log(response == true);
        this.dataService.setDMN(response); //set current DMN
      });

    }, error => {
      console.log("Something went wrong getting dmn file.");
      console.log(error);
    });
  }

  /**
   * 
   * @param file DMN object to store in XML file
   * Creates a text file in XML and stores it (still doesn't write) where indicated in file
   */
  saveToXML(file: any) {

    this.dmn.toXML(this.dataService.dmn, (err, res) => {
      this.currentXML = res;
      if (err) {
        console.log(err);
      }
      this.dataService.setXML(res);
      console.log(res);
    });
  }

  /**
   * 
   * @param table Object DecisionTable created in the table Component that contains all the necessary information
   * This function uses the object DecisionTable to instantiate a DMN with the same info.
   */
  toDMN(table: _.DecisionTable) {

    this.currentDMN.drgElements[0].decisionTable = table;
    this.dataService.setDMN(this.currentDMN);
    //console.log(this.currentDMN);
  }

  /**
   * 
   * @param dmn DMN object
   * Converts a DMN object in a DecisionTable object that can be presented and edited in the Table Component
   */
  toDecisionTable(dmn: any) {
    this.currentDMN = this.dataService.dmn;

    if (!this.currentDMN) {
      console.log("Current dmn is empty");
      return;
    }

    //Create currentDecisionTable
    //console.log(`Current DMN:`);
    //console.log(this.currentDMN);

    //Definitions stores Name, Id, Namespace and drgElements (With the decision table in it)
    this.currentDefinitions = new _.Definitions();
    this.currentDefinitions.name = this.currentDMN.name;
    this.currentDefinitions.id = this.currentDMN.id;
    this.currentDefinitions.namespace = this.currentDMN.namespace;
    this.currentDefinitions.drgElements = this.currentDMN.drgElements;

    //console.log('Current definitions');
    //console.log(this.currentDefinitions);

    this.currentDecisionTable = new _.DecisionTable();
    this.currentDecisionTable.hitPolicy = this.currentDefinitions.drgElements[0].decisionTable.hitPolicy;
    this.currentDecisionTable.preferredOrientation = this.currentDefinitions.drgElements[0].decisionTable.preferredOrientation;
    this.currentDecisionTable.outputLabel = this.currentDefinitions.drgElements[0].decisionTable.outputLabel;
    this.currentDecisionTable.input = this.currentDefinitions.drgElements[0].decisionTable.input;
    this.currentDecisionTable.output = this.currentDefinitions.drgElements[0].decisionTable.output;
    this.currentDecisionTable.rule = this.currentDefinitions.drgElements[0].decisionTable.rule;
    this.currentDecisionTable.aggregation = this.currentDefinitions.drgElements[0].decisionTable.aggregation;
    this.currentDecisionTable.id = this.currentDefinitions.drgElements[0].decisionTable.id;


    //this.currentDecisionTable = this.currentDefinitions.drgElements[0].decisionTable;
    //this.currentDecisionTable.hitPolicy = this.currentDMN.drgElements[0].decisionTable.hitPolicy; //Hit policy
    //this.currentDecisionTable.preferredOrientation
    //console.log(this.currentDecisionTable);
    //console.log(this.currentDecisionTable.input);
    this.currentDMNUpdates.next(this.currentDecisionTable);
    this.dataService.setTable(this.currentDecisionTable);
  }

  /**
   * Prepares and returns a DMN object to instantiate a new input in a Decision Table 
   */
  newInput(): any {
    let inputExpression = this.dmn.create('dmn:LiteralExpression');
    //id text typeRef
    inputExpression.set('id', '');
    inputExpression.set('text', 'Input Expression');
    inputExpression.set('typeRef', `${_.QName.string}`);

    let inputClause = this.dmn.create('dmn:InputClause');
    inputClause.set('id', '');
    inputClause.set('label', '');
    inputClause.set('inputExpression', inputExpression);

    return inputClause;
  }

  /**
   * Prepares and returns a new Input Entry for the rules in a Decision Table
   */
  newInputEntry(): any {
    let inputEntry = this.dmn.create('dmn:UnaryTests');
    inputEntry.set('id', '');
    inputEntry.set('text', '-');

    return inputEntry;
  }

  /**
   *  Prepares and returns a DMN object to instantiate a new output in a Decision Table 
   */
  newOutput(): any {
    let outputClause = this.dmn.create('dmn:OutputClause');
    //Should I set a label? Review the specs
    outputClause.set('id', '');
    outputClause.set('typeRef', 'string');

    return outputClause;
  }

  /**
   * Prepares and returns a new Output Entry for the rules in a Decision Table
   */
  newOutputEntry(): any {
    let outputEntry = this.dmn.create('dmn:LiteralExpression');
    outputEntry.set('id', '');
    outputEntry.set('text', '-');

    return outputEntry;
  }

  /**
   * Adds a new rule to the DMN (doesn't work from the columns but from another rule)
   */
  newRule(): any {
    let newRule = this.dmn.create('dmn:DecisionRule');
    newRule.set('id', '');
    newRule.set('description', '');

    let inputEntries = [];
    /*rule.inputEntry.forEach(inputEntry => {
      let newInputEntry = this.dmn.create('dmn:UnaryTests');
      newInputEntry.set('expressionLanguage', inputEntry.expressionLanguage);
      newInputEntry.set('text', inputEntry.text);

      inputEntries.push(newInputEntry);

    });*/
    newRule.set('inputEntry', inputEntries);

    let outputEntries = [];
    /*rule.outputEntry.forEach(outputEntry => {
      let newOutputEntry = this.dmn.create('dmn:LiteralExpression');

      newOutputEntry.set('text', outputEntry.text);
      newOutputEntry.set('expressionLanguage', outputEntry.expressionLanguage);

      if (outputEntry.importedValues) {
        let newImportedValues = this.dmn.create('dmn:ImportedValues');
        newImportedValues.set('expressionLanguage', outputEntry.importedValues.expressionLanguage);
        newImportedValues.set('importedElement', outputEntry.importedValues.importedElement);

        newOutputEntry.set('importedValues', newImportedValues);
      }

      outputEntries.push(newOutputEntry);
    });*/
    newRule.set('outputEntry', outputEntries);

    return newRule;
  }

  generateRuleInputEntries(ruleId: string): Array<_.UnaryTests> {
    const result = new Array<_.UnaryTests>();

    const inputs = this.dataService.dmn.drgElements[0].decisionTable.input;
    let count = 1;
    inputs.forEach(input => {
      let inputEntry = this.dmn.create('dmn:UnaryTests');

      inputEntry.set('id', `${ruleId}input${count}`);
      inputEntry.set('text', '-');

      result.push(inputEntry);
      count++;
    });

    return result;
  }

  generateRuleOutputEntries(ruleId: string): Array<_.LiteralExpression> {
    const result = new Array<_.LiteralExpression>();

    const outputs = this.dataService.dmn.drgElements[0].decisionTable.output;
    let count = 1;
    outputs.forEach(output => {
      let outputEntry = this.dmn.create('dmn:LiteralExpression');

      outputEntry.set('id', `${ruleId}output${count}`);
      outputEntry.set('text', '-');

      result.push(outputEntry);
    });

    return result;
  }

}
