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
    console.log(this.params)
    this.setValue("Edited");
  }

  deleteRow() {
    //console.log("Delete Row");
    //console.log(this.params);
    this.crudService.deleteRow(this.params.rowIndex);
  }

  deleteColumn() {
    console.log("Delete Column");
    console.log(this.params);
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