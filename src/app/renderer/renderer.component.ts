import { Component, OnInit } from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
  selector: 'app-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.css']
})
export class RendererComponent implements OnInit, ICellRendererAngularComp {

  params;
  text;
  constructor() { }

  ngOnInit() {
  }

  refresh(): boolean{
    return false;
  }

  agInit(params: any): void{
    this.params = params;
    console.log(params);
    this.text = params.value;
  }

  edition(){
    console.log("button edition triggered");
    console.log(this.params)
    this.setValue("Edited");
  }

  setValue(value: string){
    this.params.setValue(value);
  }

  enter(){
    if((this.params.value !== this.text) && (this.text)){
      this.setValue(this.text);
    }
  }

}