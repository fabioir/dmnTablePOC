import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";

import { CrudService } from '../crud.service';

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css']
})
export class RendererComponent implements OnInit, ICellRendererAngularComp {

  params;
  text;
  class;
  constructor(
    private crudService: CrudService
  ) { }

  ngOnInit() {
  }

  refresh(): boolean {
    return false;
  }

  agInit(params: any): void {
    this.params = params;
    //console.log(params);
    this.text = params.value;
    this.addClass(params.eGridCell.classList);
  }

  edition() {
    console.log("button edition triggered");
    console.log(this.params);
    console.log("Setting value from the renderer");
    this.setValue("Edited");
    /*
//get column number
const column = this.params.column;
const allColumns = this.params.column.parent.children;
let columnIndex;

for(let index = 0; index < allColumns.length; index++){
  if(allColumns[index] === column){
    columnIndex = index;
  }
  
}

console.log(allColumns);

    this.crudService.updateRow(this.params.rowIndex,columnIndex + 1,"Edited");*/
  }

  deleteRow() {
    //console.log("Delete Row");
    //console.log(this.params);
    this.crudService.deleteRow(this.params.rowIndex);
  }

  deleteColumn() {
    
    const column = this.params.column;
    const allColumns = this.params.column.parent.children;
    let columnIndex;

    for (let index = 0; index < allColumns.length; index++) {
      if (allColumns[index] === column) {
        columnIndex = index;
      }

    }
    const inOrOut = column.parent.originalColumnGroup.colGroupDef.headerName;

    if(inOrOut === 'Input'){}
    
    switch(inOrOut){
      case 'Input':
      this.crudService.deleteInput(columnIndex);
      break;

      case 'Output':
      this.crudService.deleteOutput(columnIndex);
      break;

      default:
      break;
    }
    

  }

  setValue(value: string) {
    this.params.setValue(value);
  }

  enter() {
    if ((this.params.value !== this.text) && (this.text)) {
      this.setValue(this.text);
    }
  }

  addClass(classes: any) {
    classes.forEach(element => {
      if (element === 'input-cell') {
        this.class = element;
      }

      if (element === 'output-cell') {
        this.class = element;
      }

    });
  }


}