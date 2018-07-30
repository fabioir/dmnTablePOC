import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AgGridNg2 } from 'ag-grid-angular';
import { DmnService } from '../dmn.service';
import { Subscription } from 'rxjs';

import { DataService } from '../data.service';

import * as _ from '../metamodel-classes/metamodelClasses';
import { equalParamsAndUrlSegments } from '../../../node_modules/@angular/router/src/router_state';

import { RendererComponent } from '../renderer/renderer.component';

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
  xmlSubscription: Subscription;
  xml;
  url;
  gridSizePolicy = "Size to fit";

  private frameworkComponents = {
    renderer: RendererComponent
  };

  constructor(
    private dmnService: DmnService,
    private http: HttpClient,
    private dataService: DataService
  ) { }

  /**
   * Loads the default dmn XML stored in assets. Suscribes to the data service changes in the DMN and the XML
   */
  ngOnInit() {
    this.dmnService.defaultStart(); //Import default table
    this.keepTableUpdated(); //Subscribe to table changes
    this.keepXMLUpdated();
  }

  /**
   * Unsuscribes the observables
   */
  ngOnDestroy() {
    this.decisionTableSubscription.unsubscribe();
    this.xmlSubscription.unsubscribe();
  }

  /**
   * Currently not being used
   * @param params event parameters
   */
  onGridReady(params) {
    console.log("The grid is ready");
    //this.updateFromDecisionTable();
  }

  /**
   * Checks if the clicked cell is in the last row and adds a new row if it was so
   * @param params parameters of the event
   */
  onCellClicked(params) {

    let rowData = this.agGrid.api.getRenderedNodes();
    //console.log(rowData);
    let lastRow = rowData[rowData.length - 1];
    if (lastRow.data.number === params.data.number) {
      this.addRow();
      //console.log("Last row clicked");
    }
  }

  
  /**
   * Adds a new row to the dmn through the dmn service.
   */
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

  /**
   * Adds a new input to the dmn through the dmn service.
   */
  addInput() {
    this.decisionTable.newInput(this.dmnService.newInput());

    if (this.decisionTable.rule) {
      this.decisionTable.newInputEntry(this.dmnService.newInputEntry());
    }
    console.log(this.agGrid.gridOptions.columnDefs);
    this.updateFromDecisionTable();

    let columnDefs = this.agGrid.columnApi.getAllColumns();
    console.log(this.decisionTable.rule);
    //this.agGrid.api.setColumnDefs(columnDefs);
  }

  /**
   * Adds a new output to the dmn through the dmn service.
   */
  addOutput() {
    this.decisionTable.newOutput(this.dmnService.newOutput());

    if (this.decisionTable.rule) {
      this.decisionTable.newOutputEntry(this.dmnService.newOutputEntry());
    }

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
   * Subscribes to current Decision Table in the data service and updates the grid every time this is changed
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

  /**
   * Subscribes to the Observable launched from the data service and keeps the xml updated to being downloaded at any moment
   */
  keepXMLUpdated() {
    this.xml = this.dataService.xml;

    this.xmlSubscription = this.dataService.getXMLUpdates().subscribe(xml => {
      this.xml = xml;
    })
  }


/**
 * Manually invoques the dmn service that transforms and stores the current DMN to the XML format
 */
  saveToXML() {
    this.dmnService.saveToXML('');
  }

  /**
   * Invoques the functions that build the Columns and cells of the table
   */
  updateFromDecisionTable() {
    this.updateColumnDefs();
    this.updateCells();
    this.sizePolicy('');
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
        columns.push({ headerName: `${input.inputExpression.text} (${input.inputExpression.typeRef})`, field: `iv${count}`, editable: true, colId: `input${count}`, cellRenderer: "renderer",  cellClass: 'input-cell' });
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
        columns.push({ headerName: `${output.typeRef}`, field: `ov${count}`, editable: true, colId: `output${count}`, cellRenderer: "renderer",  cellClass: 'output-cell' });
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

  /**
   * Generates and downloads a .dmn text file
   */
  downloadDMN() {
    var pom = document.createElement('a');
    var filename = "file.dmn";
    let blob = new Blob([this.xml], { type: 'text/plain' });

    pom.setAttribute('href', window.URL.createObjectURL(blob));
    pom.setAttribute('download', filename);

    pom.draggable = true;
    pom.classList.add('dragout');

    pom.click();
  }

  /**
   * Resizes the grid columns to fit the available space
   */
  sizeToFit() {
    this.agGrid.api.sizeColumnsToFit();
  }

  /**
   * Resizes the grid columns to use the optimum space
   */
  autoSize() {
    this.agGrid.columnApi.autoSizeAllColumns();
  }

  /**
   * When called with a parameter sets the global policy of display of the columns. 
   * Called without parameters executes the set policy and calls the appropiate function that resizes the grid.
   * @param params 'Autosize' or 'Size to fit' (default)
   */
  sizePolicy(params){
    if(params){
    //console.log(params);
    this.gridSizePolicy = params.value;
    this.sizePolicy('');
    }else{
      if(this.gridSizePolicy === "Autosize"){
        this.autoSize();
      }else{
        this.sizeToFit();
      }
    }
  }

  /**
   * Manages the edition of the table and reflects it in the Decision Table Object stored in the data service
   * @param params The edition event triggered by the grid
   */
  onCellEdit(params) {
    console.log(params);
    console.log(this.agGrid.columnApi.getAllColumns());
    console.log(this.dataService.table);
    let newDecisionTable = this.dataService.table;

    //Find out the index of the column
    let col = params.column;
    let columns = this.agGrid.columnApi.getAllColumns();
    let index;


    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      if (columns[colIndex] === col) {
        console.log('Columns match ' + (params.rowIndex + 1) + ' ' + colIndex);
        index = colIndex;
        break;
      }
    }
    let inputEntryLength = newDecisionTable.rule[params.rowIndex].inputEntry.length;
    if (inputEntryLength >= (index)) {

      newDecisionTable.rule[params.rowIndex].inputEntry[index - 1].text = params.newValue;
      this.dataService.setTable(newDecisionTable);
    } else {
      newDecisionTable.rule[params.rowIndex].outputEntry[index - 1 - inputEntryLength].text = params.newValue;
      this.dataService.setTable(newDecisionTable);
    }
    //this.dmnService.toDMN(this.dataService.table); => crashes the app
    this.dmnService.saveToXML('');
  }

  /**
   * Reacts to a Drag and Drop action and performs the necessary changes to the DMN
   * @param params Drag Event
   */
  onCellDrag(params){
    console.log("You've dragged and droped");
  }

}