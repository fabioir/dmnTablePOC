import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

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
  constructor(private crudService: CrudService) {}

  ngOnInit() {}

  /**
   * Invoqued by AGgrid, returns allways false so the cell is allways re-rendered
   */
  refresh(): boolean {
    return false;
  }

  /**
   * Kind of constructor invoqued by ag grid when a cell is instantiated
   * @param params ag-Grid params passed as argument
   */
  agInit(params: any): void {
    this.params = params;
    // console.log(params);
    this.text = params.value;
    this.addClass(params.eGridCell.classList);
  }

  /**
   * Just to test the assisted addition, will be different
   */
  edition() {
    console.log('button edition triggered');
    console.log(this.params);
    console.log('Setting value from the renderer');
    this.setValue('Edited');
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

  /**
   * Asks the crud service to delete the row to which this cells belongs
   */
  deleteRow() {
    // console.log("Delete Row");
    // console.log(this.params);
    this.crudService.deleteRow(this.params.rowIndex);
  }

  /**
   * Finds out the column of the cell and asks the crud service to delete it
   */
  deleteColumn() {
    const column = this.params.column;
    const allColumns = this.params.column.parent.children;
    let columnIndex;

    // Do it with indexOf()
    for (let index = 0; index < allColumns.length; index++) {
      if (allColumns[index] === column) {
        columnIndex = index;
      }
    }
    const inOrOut = column.parent.originalColumnGroup.colGroupDef.headerName;

    switch (inOrOut) {
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

  /**
   * Sets a new value for the cell
   * @param value new Value
   */
  setValue(value: string) {
    this.params.setValue(value);
  }

  /**
   * Hiting enter will set a new value
   */
  enter() {
    if (this.params.value !== this.text && this.text) {
      this.setValue(this.text);
    }
  }

  /**
   * determines the class (input or output) so the css can contrast input and output columns
   * @param classes classes provided by agGrid
   */
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
