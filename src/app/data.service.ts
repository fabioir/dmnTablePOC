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

  /**
   * Sets the .dmn document
   * @param xml new .dmn document
   */
  setXML(xml: string) {
    if (xml) {
      this.xml = xml;
      this.xmlUpdate.next(this.xml);
    } else {
      console.log('XML problem');
    }
  }

  /**
   * Sets the DMN Moddle object
   * @param dmn object created with the Moddle
   */
  setDMN(dmn: Definitions) {
    console.log('setting dmn in data service');
    if (dmn) {
      this.dmn = dmn;
      this.dmnUpdate.next(this.dmn);
    } else {
      console.log('DMN problem');
    }
  }

  /**
   * Sets the Decision table
   * @param table Object DecisionTable
   */
  setTable(table: DecisionTable) {
    if (table) {
      this.table = table;
      this.tableUpdate.next(this.table);
    } else {
      console.log('Decision Table problem');
    }
  }

  /**
   * Returns an observable with the .dmn document updates
   */
  getXMLUpdates(): Observable<string> {
    return <Observable<string>>this.xmlUpdate.asObservable();
  }

  /**
   * Returns an observable with the DMN Moddle object updates
   */
  getDMNUpdates(): Observable<Definitions> {
    return <Observable<Definitions>>this.dmnUpdate.asObservable();
  }

  /**
   * Returns an observable with the Decision Table updates
   */
  getTableUpdates(): Observable<DecisionTable> {
    return <Observable<DecisionTable>>this.tableUpdate.asObservable();
  }

}
