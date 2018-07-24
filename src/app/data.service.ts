import { Injectable } from '@angular/core';
import { Definitions, DecisionTable } from './metamodel-classes/metamodelClasses';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  xml: string;
  dmn: Definitions;
  table: DecisionTable;

  xmlUpdate = new Subject();
  dmnUpdate = new Subject();
  tableUpdate = new Subject();

  constructor() { }

  setXML(xml: string) {
    if (xml) {
      this.xml = xml
      this.xmlUpdate.next(this.xml);
    } else {
      console.log("XML problem");
    }
  }

  setDMN(dmn: Definitions) {
    if (dmn) {
      this.dmn = dmn;
      this.dmnUpdate.next(this.dmn);
    } else {
      console.log("DMN problem");
    }
  }

  setTable(table: DecisionTable) {
    if (table) {
      this.table = table;
      this.tableUpdate.next(this.table);
    } else {
      console.log("Decision Table problem");
    }
  }

  getXMLUpdates(): Observable<string> {
    return <Observable<string>>this.xmlUpdate.asObservable();
  }

  getDMNUpdates(): Observable<Definitions> {
    return <Observable<Definitions>>this.dmnUpdate.asObservable();
  }

  getTableUpdates(): Observable<DecisionTable> {
    return <Observable<DecisionTable>>this.tableUpdate.asObservable();
  }

}
