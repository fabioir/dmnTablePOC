import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AgGridNg2 } from 'ag-grid-angular';
import { DmnService } from '../dmn.service';
import { Subscription } from 'rxjs';

import { DataService } from '../data.service';

import * as _ from '../metamodel-classes/metamodelClasses';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {

  //Variables
  @ViewChild('agGrid') agGrid: AgGridNg2;
  decisionTable: _.DecisionTable; //Attached to a Observable from the data service
  decisionTableSubscription: Subscription;


  constructor(
    private dmnService: DmnService,
    private http: HttpClient,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dmnService.defaultStart(); //Import default table
    this.keepTableUpdated(); //Subscribe to table changes
  }
  ngOnDestroy() {
    this.decisionTableSubscription.unsubscribe();
  }
  onGridReady(params) {
    console.log("The grid is ready");
    //this.updateFromDecisionTable();
  }

  onCellClicked(params) {

    let rowData = this.agGrid.api.getRenderedNodes();
    //console.log(rowData);
    let lastRow = rowData[rowData.length - 1];
    if (lastRow.data.number === params.data.number) {
      this.addRow();
      //console.log("Last row clicked");
    }
  }

  addRow() {
    let rule = this.decisionTable.rule[0];
    const newRule = new _.DecisionRule();
    newRule.clone(rule);

    newRule.inputEntry.forEach(input => { input.text = '-' });
    newRule.outputEntry.forEach(output => { output.text = '-' });
    console.log(this.decisionTable)
    this.decisionTable.rule.push(this.dmnService.newRule(newRule));
    //console.log();
    this.dataService.setTable(this.decisionTable);
  }

  addInput() {
    this.decisionTable.newInput(this.dmnService.newInput());
    this.decisionTable.newInputEntry(this.dmnService.newInputEntry());
    console.log(this.agGrid.gridOptions.columnDefs);
    this.updateFromDecisionTable();

    let columnDefs = this.agGrid.columnApi.getAllColumns();
    console.log(this.decisionTable.rule);
    //this.agGrid.api.setColumnDefs(columnDefs);
  }

  addOutput() {
    this.decisionTable.newOutput(this.dmnService.newOutput());
    this.decisionTable.newOutputEntry(this.dmnService.newOutputEntry());
    this.updateFromDecisionTable();
  }

  /**
   * 
   * @param event file uploaded triggers a change event
   * This function reacts to a local XML file upload and asks the dmn service to parse it
   */
  onFileChanged(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        //this.formGroup.patchValue({
        //file: reader.result
        //});
        this.dmnService.importXML(reader.result);
        /*this.http.get(reader.result, { responseType: 'text' }).subscribe(data => {
          console.log(data);
        });*/
      };
    }
  }



  /**
   * Subscribes to current Decision Table in the data service
   */
  keepTableUpdated() {

    this.decisionTable = this.dataService.table;
    if (this.decisionTable) {
      this.updateFromDecisionTable();
    }
    this.decisionTableSubscription = this.dataService.getTableUpdates().subscribe(decisionTable => {
      this.decisionTable = decisionTable;
      this.updateFromDecisionTable();
    });
  }



  saveToXML() {
    this.dmnService.saveToXML('');
  }

  /**
   * Invoques the functions that build the Columns and cells of the table
   */
  updateFromDecisionTable() {
    this.updateColumnDefs();
    this.updateCells();
  }


  /**
   * Builds a new column definition according to what is in the DecisionTable Object
   */
  updateColumnDefs() {
    //Update Hit policy
    let HP = 'F'; //Default hit policy
    if (this.dataService.dmn) {
      HP = this.dataService.dmn.drgElements[0].decisionTable.hitPolicy.replace(" ", "");
      HP = _.ReverseHitPolicy[HP];
    }

    //Update Information Item Name
    let ITN = 'Information Item Name';
    if (this.dataService.dmn) {
      if (this.dataService.dmn.drgElements[0].name !== '') {
        ITN = this.dataService.dmn.drgElements[0].name;
      }
    }

    //Building the first column
    let firstCol = {
      headerName: '', field: '', id: 'overHit', suppressMovable: true, width: 120, suppressResize: true, pinned: 'left',
      children: [
        { headerName: HP, field: 'number', width: 120, rowDrag: true, suppressResize: true, colId: 'hitPolicy', lockPosition: true }
      ]
    };

    //Building Input Columns
    let inputColumns = this.buildInputColumns();

    //Building Output Columns
    let outputColumns = this.buildOutputColumns();

    //Assembling all the columns together
    let columnDefs = [
      {
        headerName: ITN, field: 'infItemName', pinned: 'left', colId: 'decisionName',
        children: [firstCol, inputColumns, outputColumns]
      }];

    //Setting columns to the grid (When in edition step we'll have to check synchro among displayed and stored table)
    this.agGrid.api.setColumnDefs(columnDefs);
    console.log(this.agGrid.columnApi.getAllColumns());
  }

  /**
   * Builds the input columns from the decision table updated respect to the one stored in the data service
   */
  buildInputColumns(): any {
    let columns = [];
    let count = 1;
    if (this.decisionTable) {
      this.decisionTable.input.forEach(input => {
        columns.push({ headerName: `${input.inputExpression.text} (${input.inputExpression.typeRef})`, field: `iv${count}`, editable: true, colId: `input${count}` });
        //Make sure you know what to put here. Might need to change the Metamodel
        //Let's take care of specification conformance
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

  /**
   * Builds the output columns from the decision table updated respect to the one stored in the data service
   */
  buildOutputColumns(): any {
    let columns = [];
    let count = 1;

    if (this.decisionTable) {
      this.decisionTable.output.forEach(output => {
        //console.log(output)
        columns.push({ headerName: `${output.typeRef}`, field: `ov${count}`, editable: true, colId: `output${count}` });
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

  /**
   * Gets the data stored in the decision table (updated respect to the one stored in the data service) and fills the rows
   */
  updateCells() {
    let rowData = [];
    let count = 0;

    if (this.decisionTable.rule) {
      this.decisionTable.rule.forEach(rule => {

        let newRow = {};
        newRow['number'] = count + 1;
        newRow['id'] = count + 1;
        count++;

        //Filling each input column
        let inputNumber = 1;

        rule.inputEntry.forEach(inputEnt => {
          newRow[`iv${inputNumber}`] = inputEnt.text.replace(/["']/g, "");
          inputNumber++;
        });

        //Filling each output column
        let outputNumber = 1;

        rule.outputEntry.forEach(outputEnt => {
          newRow[`ov${outputNumber}`] = outputEnt.text.replace(/["']/g, "");
          outputNumber++;
        });

        rowData.push(newRow);
      });
    }

    //Setting rows to the grid (When in edition step we'll have to check synchro among displayed and stored table)
    this.agGrid.api.setRowData(rowData);
    //console.log(this.agGrid.api.getRenderedNodes())
  }

  /**
   * Asks the smn Service to load an example stored in the assets folderS
   */
  example() {
    this.dmnService.importXML('/assets/table.dmn');
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