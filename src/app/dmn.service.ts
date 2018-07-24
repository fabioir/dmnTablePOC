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

  ngOnInit() {
    this.subscribeToChanges();
  }

  ngOnDestroy() {
    this.dmnUpdates.unsubscribe();
    this.xmlUpdates.unsubscribe();
    this.tableUpdates.unsubscribe();
  }

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

  defaultStart() {
    this.subscribeToChanges();
    console.log("Default start");
    this.importXML('../../assets/default.dmn');
    console.log(this.dataService.xml);
    this.toDecisionTable(this.currentDMN);
  }

  /**
   * Returns an Observable<DecisionTable> with the current decision table.
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

    this.dmn.toXML(this.currentDMN, (err, res) => {
      this.currentXML = res;
      if (err) {
        console.log(err);
      }
      this.dataService.setXML(res);
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
    
    if(!this.currentDMN){
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

}
