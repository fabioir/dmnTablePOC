import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AgGridNg2 } from 'ag-grid-angular';
import { DmnService } from '../dmn.service';
import { Subscription } from 'rxjs';

import * as _ from '../metamodel-classes/metamodelClasses';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {

  @ViewChild('agGrid') agGrid: AgGridNg2;
  decisionTable: _.DecisionTable; //Attached to a Observable from the DMN service
  decisionTableSubscription: Subscription;



  constructor(
    private dmnService: DmnService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.keepTableUpdated();
    this.parseLocalXML(); //

  }

  logFile() {
    //console.log(this.file);
  }

  onFileChanged(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        //this.formGroup.patchValue({
        //file: reader.result
        //});
        this.dmnService.importLocalXML(reader.result);
        /*this.http.get(reader.result, { responseType: 'text' }).subscribe(data => {
          console.log(data);
        });*/
      };
    }
  }

  ngOnDestroy() {
    this.decisionTableSubscription.unsubscribe();
  }

  /**
   * Subscribes to current Decision Table in the dmn service
   */
  keepTableUpdated() {

    this.decisionTable = this.dmnService.currentDecisionTable;

    this.decisionTableSubscription = this.dmnService.getUpdates().subscribe(decisionTable => {
      this.decisionTable = decisionTable;
      this.updateFromDecisionTable();
    });
  }

  parseLocalXML() {
    this.dmnService.importLocalXML('../../assets/table.dmn');
  }

  parseToTable(){
    this.dmnService.toDecisionTable({});
  }

  onGridReady(params) {
    console.log("OnGrid ready function has been triggered");
    //this.updateFromDecisionTable();
  }

  updateFromDecisionTable() {
    this.updateColumnDefs();
    this.updateCells();
  }

  saveToXML(){
    this.dmnService.saveToXML('');
  }

  /**
   * Builds a new column definition according to what is in the DecisionTable Object
   */
  updateColumnDefs() {
    //Update Information Item Name
    let HP = 'F';
    if (this.dmnService.currentDefinitions) {
      HP = this.dmnService.currentDefinitions.drgElements[0].decisionTable.hitPolicy.replace(" ", "");
      HP = _.ReverseHitPolicy[HP];
    }
    let firstCol = {
      headerName: '', field: '', id: 'overHit', suppressMovable: true, width: 120, suppressResize: true, pinned: 'left',
      children: [
        { headerName: HP, field: 'number', width: 120, rowDrag: true, suppressResize: true, colId: 'hitPolicy', lockPosition: true }
      ]
    };

    //Push Input Columns
    let inputColumns = this.buildInputColumns();

    //Push Output Columns
    let outputColumns = this.buildOutputColumns();

    //Update Information Item Name
    let ITN = 'Information Item Name';
    if (this.dmnService.currentDefinitions) {
      ITN = this.dmnService.currentDefinitions.drgElements[0].name;
    }
    let columnDefs = [
      {
        headerName: ITN, field: 'infItemName', pinned: 'left', colId: 'decisionName',
        children: [firstCol, inputColumns, outputColumns]
      }];

    this.agGrid.api.setColumnDefs(columnDefs);

    //console.log(columnDefs);
  }

  buildInputColumns(): any {
    let columns = [];
    let count = 1;

    if (this.decisionTable) {
      this.decisionTable.input.forEach(input => {
        //console.log(input)
        columns.push({ headerName: `${input.inputExpression.text} (${input.inputExpression.typeRef})`, field: `iv${count}`, editable: true, colId: `input${count + 1}` });//Make sure what to put here. Might need to change the Metamodel
        count++;
      });
      if (this.decisionTable.input.length === 0) {
        columns.push({ headerName: 'Input Expression 1', field: `iv${count}`, editable: true, colId: 'input1' });
      }
    } else {
      columns.push({ headerName: 'Input Expression 1', field: `iv${count}`, editable: true, colId: 'input1' });
    }
    return {
      headerName: 'Input', field: '', colId: 'inputs', suppressMovable: true, lockPosition: true, marryChildren: true,
      children: columns
    };
  }

  buildOutputColumns(): any {
    let columns = [];
    let count = 1;

    if (this.decisionTable) {
      this.decisionTable.output.forEach(output => {
        //console.log(output)
        columns.push({ headerName: `${output.typeRef}`, field: `ov${count}`, editable: true, colId: `output${count + 1}` });
        count++;
      });
      if (this.decisionTable.output.length === 0) {
        columns.push({ headerName: 'Output Expression 1', field: `ov${count}`, editable: true, colId: 'output1' });
      }
    } else {
      columns.push({ headerName: 'Output Expression 1', field: `ov${count}`, editable: true, colId: 'output1' });
    }
    return {
      headerName: 'Output', field: '', colId: 'outputs', suppressMovable: true, lockPosition: true, marryChildren: true,
      children: columns
    };
  }

  updateCells() { //Make it dynamic according to the columns. Go throug nested loops, for each rule a row, for each entry a cell edition and tab to the next.
    let rowData = [];
    let count = 0;

    if (this.decisionTable) {
      this.decisionTable.rule.forEach(rule => {

        let newRow = {};
        //let index = 0;
        newRow['number'] = count + 1;
        newRow['id'] = count + 1;
        count++;
        //index++;
        let inputNumber = 1;
        rule.inputEntry.forEach(inputEnt => {
          newRow[`iv${inputNumber}`] = inputEnt.text.replace(/["']/g, "");
          inputNumber++;
        });
        let outputNumber = 1;
        rule.outputEntry.forEach(outputEnt => {
          newRow[`ov${outputNumber}`] = outputEnt.text.replace(/["']/g, "");
          outputNumber++;
        });
        //console.log(newRow)
        rowData.push(newRow);
      });

      if (this.decisionTable.rule.length === 0) {
        rowData.push({ number: '1', iv1: '-', ov1: '-' });
        //const keyName = "v99";
        //rowData[4][keyName] = "fabio";
      }
    } else {
      rowData.push({ id: '1', number: '1', iv1: '-', ov1: '-' });
    }
    //rowData = [{ id: '1', number: '1', iv1: '-', ov1: '-' }];
    this.agGrid.api.setRowData(rowData);
    //console.log(`Node: ${this.agGrid.gridOptions}`);
  }


}
/*columnDefs = [
    {
      headerName: 'Information Item Name', field: 'infItemName', pinned: 'left', colId: 'decisionName',
      children: [
        {
          headerName: '', field: '', id: 'overHit', suppressMovable: true, width: 120, suppressResize: true, pinned: 'left',
          children: [
            { headerName: 'H', field: 'number', width: 120, rowDrag: true, suppressResize: true, colId: 'hitPolicy', lockPosition: true }//width always in pixels, never percentages
          ]
        },
        {
          headerName: '', field: '', colId: 'inputs', suppressMovable: true, lockPosition: true, marryChildren: true,
          children: [
            //{ headerName: 'Input Expression 1', field: 'iv1', editable: true, colId: 'input1' }
          ]
        },
        {
          headerName: '', field: '', colId: 'outputs', suppressMovable: true, lockPosition: true, marryChildren: true, pinned: 'right',
          children: [
            //{ headerName: 'Output Label 1', field: 'oV1', editable: true, colId: 'output1' }
          ]
        }
      ]
    }
  ];
  
  rowData = [
    { number: '1', iv1: '-', oV1: '-' }
  ];
  */