import { Injectable, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import DmnModdle from 'dmn-moddle';
import * as _ from './metamodel-classes/metamodelClasses';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class DmnService implements OnInit{

  dmn: DmnModdle = new DmnModdle();
  currentDMN;
  currentDecisionTable: _.DecisionTable;
  currentDMNUpdates = new Subject();

  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit(){
  }

  /**
   * Returns an Observable<DecisionTable> with the current decision table.
   */
  getUpdates(): Observable<_.DecisionTable>{
    return <Observable<_.DecisionTable>> this.currentDMNUpdates.asObservable();
  }

  /**
   * 
   * @param url Local URL (assets) where the XML is
   * This function fetches and parses to DMN a XML file stored in a local route (assets recomended). Let's find out how to import a local file from the system no matter the origin...
   */
   importLocalXML(url: string){
    this.http.get(url, { responseType: 'text' }).subscribe(data => {
      this.dmn.fromXML(data, 'dmn:Definitions', (e,r) => {
        this.currentDMN = r;
        console.log("Importing from XML to DMN: ");
        console.log(this.currentDMN);

        //Should delete this line...
        this.saveToXML(this.currentDMN.id);
      });
    
    }, error => {
      console.log("Something went wrong getting local dmn file.");
      console.log(error);
    });
   }

  /**
   * 
   * @param file DMN object to store in XML file
   * Creates a text file in XML and stores it (still doesn't write) where indicated in file
   */
   saveToXML(file: any){
     const fileXML = this.dmn.toXML(this.currentDMN, (err, res) => {
       console.log(`Saving from DMN to XML (path: ${file}): `);
      console.log(res);
    });

     console.log( fileXML );
   }

  /**
   * 
   * @param table Object DecisionTable created in the table Component that contains all the necessary information
   * This function uses the object DecisionTable to instantiate a DMN with the same info.
   */
   toDMN(table: _.DecisionTable){

   }

   /**
    * 
    * @param dmn DMN object
    * Converts a DMN object in a DecisionTable object that can be presented and edited in the Table Component
    */
   toDecisionTable(dmn: any){
     //Create currentDecisionTable
     this.currentDMNUpdates.next(this.currentDecisionTable);
   }
   
}
