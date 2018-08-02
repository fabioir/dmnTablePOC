import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AgGridNg2 } from 'ag-grid-angular';
import { DmnService } from '../dmn.service';
import { Subscription } from 'rxjs';

import { DataService } from '../data.service';

import * as _ from '../metamodel-classes/metamodelClasses';

import { RendererComponent } from '../renderer/renderer.component';
import { HeaderInputComponent } from '../header-input/header-input.component';
import { HeaderOutputComponent } from '../header-output/header-output.component';
import { HeaderHitComponent } from '../header-hit/header-hit.component';
import { HeaderOutputsGroupComponent } from '../header-outputs-group/header-outputs-group.component';
import { HeaderInputsGroupComponent } from '../header-inputs-group/header-inputs-group.component';
import { HeaderInformationItemGroupComponent } from '../header-information-item-group/header-information-item-group.component';

import { CrudService } from '../crud.service';

import beautify from 'xml-beautifier';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {



  // Variables
  @ViewChild('agGrid') agGrid: AgGridNg2;
  decisionTable: _.DecisionTable; // Attached to a Observable from the data service
  decisionTableSubscription: Subscription;
  xmlSubscription: Subscription;
  xml = '';
  url;
  gridSizePolicy = 'Autosize';
  rowMovedFrom;
  columnMovedTo;
  columnMoving;
  dialogRef: MatDialogRef<DialogComponent>;


  public frameworkComponents = {
    renderer: RendererComponent,
    headerInput: HeaderInputComponent,
    headerOutput: HeaderOutputComponent,
    headerOutputsGroup: HeaderOutputsGroupComponent,
    headerInputsGroup: HeaderInputsGroupComponent,
    headerHit: HeaderHitComponent,
    headerInformationItem: HeaderInformationItemGroupComponent
  };

  constructor(
    private dmnService: DmnService,
    private http: HttpClient,
    private dataService: DataService,
    private crudService: CrudService,
    public dialog: MatDialog
  ) {}

  /**
   * Loads the default dmn XML stored in assets. Suscribes to the data service changes in the DMN and the XML
   */
  ngOnInit() {
    console.log();
    this.dmnService.defaultStart(); // Import default table
    this.keepTableUpdated(); // Subscribe to table changes
    this.keepXMLUpdated();
    this.crudService.ngOnInit(); // Otherwise it doesn't initialize
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
    console.log('The grid is ready');
    // this.updateFromDecisionTable();
  }

  /**
   * Checks if the clicked cell is in the last row and adds a new row if it was so
   * @param params parameters of the event
   */
  onCellClicked(params) {
    this.createMenu(params);
    const rowData = this.agGrid.api.getRenderedNodes();
    // console.log(rowData);
    const lastRow = rowData[rowData.length - 1];
    if (lastRow.data.number === params.data.number) {
      // console.log(params);
      this.addRow();
      // console.log("Last row clicked");
    }
  }

  /**
   * Creates a menu to edit the cell
   * @param params cell clicked event
   */
  createMenu(params) {
    this.dialogRef = this.dialog.open( DialogComponent, {
      data: params,
      hasBackdrop: false
    } );

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(params);
      this.agGrid.api.startEditingCell({
        rowIndex: params.rowIndex,
        colKey: params.colDef.colId,
        charPress: result
      });
      this.agGrid.api.stopEditing();
    });
  }

  /**
   * Adds a new row to the dmn through the dmn service.
   */
  addRow() {
    this.crudService.createRow();
  }

  /**
   * Adds a new input to the dmn through the dmn service.
   */
  addInput() {
    this.crudService.createInput();
    /*
        this.decisionTable.newInput(this.dmnService.newInput());

        if (this.decisionTable.rule) {
          this.decisionTable.newInputEntry(this.dmnService.newInputEntry());
        }
        console.log(this.agGrid.gridOptions.columnDefs);
        this.updateFromDecisionTable();

        let columnDefs = this.agGrid.columnApi.getAllColumns();
        console.log(this.decisionTable.rule);
        //this.agGrid.api.setColumnDefs(columnDefs);*/
  }

  /**
   * Adds a new output to the dmn through the dmn service.
   */
  addOutput() {
    this.crudService.createOutput();
    /*
    this.decisionTable.newOutput(this.dmnService.newOutput());

    if (this.decisionTable.rule) {
      this.decisionTable.newOutputEntry(this.dmnService.newOutputEntry());
    }

    this.updateFromDecisionTable();
    */
  }

  /**
   *
   * @param event file uploaded triggers a change event
   * This function reacts to a local XML file upload and asks the dmn service to parse it
   */
  onFileChanged(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        // this.formGroup.patchValue({
        // file: reader.result
        // });
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
    this.decisionTableSubscription = this.dataService
      .getTableUpdates()
      .subscribe(decisionTable => {
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
    });
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
    // Update Hit policy
    let HP = 'F'; // Default hit policy
    if (this.dataService.dmn) {
      HP = this.dataService.dmn.drgElements[0].decisionTable.hitPolicy.replace(
        ' ',
        ''
      );
      HP = _.ReverseHitPolicy[HP];
    }

    // Update Information Item Name
    let ITN = 'Information Item Name';
    if (this.dataService.dmn) {
      if (this.dataService.dmn.drgElements[0].name !== '') {
        ITN = this.dataService.dmn.drgElements[0].name;
      }
    }

    // Building the first column
    const firstCol = {
      headerName: '',
      field: '',
      id: 'overHit',
      suppressMovable: true,
      width: 120,
      suppressResize: true,
      pinned: 'left',
      children: [
        {
          headerName: HP,
          field: 'number',
          width: 120,
          rowDrag: true,
          suppressResize: true,
          colId: 'hitPolicy',
          lockPosition: true,
          headerComponentFramework: <{ new (): HeaderHitComponent }>(
            HeaderHitComponent
          )
        }
      ]
    };

    // Building Input Columns
    const inputColumns = this.buildInputColumns();

    // Building Output Columns
    const outputColumns = this.buildOutputColumns();

    // Assembling all the columns together
    const columnDefs = [
      {
        headerName: ITN,
        field: 'infItemName',
        pinned: 'left',
        colId: 'decisionName',
        headerGroupComponentFramework: HeaderInformationItemGroupComponent,
        children: [firstCol, inputColumns, outputColumns]
      }
    ];

    // Setting columns to the grid (When in edition step we'll have to check synchro among displayed and stored table)
    this.agGrid.api.setColumnDefs(columnDefs);
    // console.log(this.agGrid.columnApi.getAllColumns());
  }

  /**
   * Builds the input columns from the decision table updated respect to the one stored in the data service
   */
  buildInputColumns(): any {
    const columns = [];
    let count = 1;
    if (this.decisionTable) {
      this.decisionTable.input.forEach(input => {
        columns.push({
          headerName: `${input.inputExpression.text} (${
            input.inputExpression.typeRef
          })`,
          field: `iv${count}`,
          editable: true,
          colId: `input${count}`,
          cellClass: 'input-cell',
          headerComponentFramework: <{ new (): HeaderInputComponent }>(
            HeaderInputComponent
          )
        });
        // Make sure you know what to put here. Might need to change the Metamodel
        // Let's take care of specification conformance
        count++;
      });
      if (this.decisionTable.input.length === 0) {
        columns.push({
          headerName: 'Input Expression 1',
          field: `iv${count}`,
          editable: true,
          colId: 'input1'
        });
      }
    } else {
      columns.push({
        headerName: 'Input Expression 1',
        field: `iv${count}`,
        editable: true,
        colId: 'input1'
      });
    }
    return {
      headerName: 'Input',
      field: '',
      colId: 'inputs',
      suppressMovable: true,
      lockPosition: true,
      marryChildren: true,
      headerGroupComponentFramework: HeaderInputsGroupComponent,
      children: columns
    };
  }

  /**
   * Builds the output columns from the decision table updated respect to the one stored in the data service
   */
  buildOutputColumns(): any {
    const columns = [];
    let count = 1;

    if (this.decisionTable) {
      this.decisionTable.output.forEach(output => {
        // console.log(output)
        columns.push({
          headerName: `${output.typeRef}`,
          field: `ov${count}`,
          editable: true,
          colId: `output${count}`,
          cellClass: 'output-cell',
          headerComponentFramework: <{ new (): HeaderOutputComponent }>(
            HeaderOutputComponent
          )
        });
        count++;
      });
      if (this.decisionTable.output.length === 0) {
        columns.push({
          headerName: 'Output Expression 1',
          field: `ov${count}`,
          editable: true,
          colId: 'output1'
        });
      }
    } else {
      columns.push({
        headerName: 'Output Expression 1',
        field: `ov${count}`,
        editable: true,
        colId: 'output1'
      });
    }
    return {
      headerName: 'Output',
      field: '',
      colId: 'outputs',
      suppressMovable: true,
      lockPosition: true,
      marryChildren: true,
      headerGroupComponentFramework: HeaderOutputsGroupComponent,
      children: columns
    };
  }

  /**
   * Gets the data stored in the decision table (updated respect to the one stored in the data service) and fills the rows
   */
  updateCells() {
    const rowData = [];
    let count = 0;

    if (this.decisionTable.rule) {
      this.decisionTable.rule.forEach(rule => {
        const newRow = {};
        newRow['number'] = count + 1;
        newRow['id'] = count + 1;
        newRow['randParam'] = Math.random();
        count++;

        // Filling each input column
        let inputNumber = 1;

        rule.inputEntry.forEach(inputEnt => {
          newRow[`iv${inputNumber}`] = inputEnt.text.replace(/["']/g, '');
          inputNumber++;
        });

        // Filling each output column
        let outputNumber = 1;

        rule.outputEntry.forEach(outputEnt => {
          newRow[`ov${outputNumber}`] = outputEnt.text.replace(/["']/g, '');
          outputNumber++;
        });

        rowData.push(newRow);
      });
    }

    // Setting rows to the grid (When in edition step we'll have to check synchro among displayed and stored table)
    this.agGrid.api.setRowData(rowData);
    // console.log(this.agGrid.api.getRenderedNodes())
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
    // First we save the dmn to XML to ensure it is updated
    this.saveToXML();
    this.xml = beautify(this.xml);
    // const XMLS = new XMLSerializer();
    // const parser = new DOMParser();
    // this.xml = XMLS.serializeToString(parser.parseFromString(this.xml, 'text/xml'));
    const pom = document.createElement('a');
    const filename = 'file.dmn';
    const blob = new Blob([this.xml], { type: 'text/plain' });

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
  sizePolicy(params) {
    if (params) {
      // console.log(params);
      this.gridSizePolicy = params.value;
      this.sizePolicy('');
    } else {
      if (this.gridSizePolicy === 'Autosize') {
        this.autoSize();
      } else {
        this.sizeToFit();
      }
    }
  }

  /**
   * Manages the edition of the table and reflects it in the Decision Table Object stored in the data service
   * @param params The edition event triggered by the grid
   */
  onCellEdit(params) {
    // Find out the index of the column
    const col = params.column;
    const columns = this.agGrid.columnApi.getAllColumns();

    // Call the crud service
    this.crudService.updateRow(
      params.rowIndex,
      columns.indexOf(col),
      params.newValue
    );
  }

  /**
   * Reacts to a Drag and Drop action and performs the necessary changes to the DMN
   * @param params Drag Event (rowDragEnter or rowDragEnd)
   */
  onCellDrag(params) {
    if (params.type === 'rowDragEnter' && params.overIndex >= 0) {
      this.rowMovedFrom = params.overIndex;
    }

    if (params.type === 'rowDragEnd' && params.overIndex >= 0) {
      this.crudService.reorderRules(this.rowMovedFrom, params.overIndex);
    }
  }

  /**
   * Reacts to column moved and drag stopped events in order to reflect this changes in the DMN when the drag has been accomplished
   * @param params Column Moved or Drag Stopped event
   */
  onColumnMove(params) {
    console.log(params);
    // Set the column that is moving and the place where it is being moved
    if (params.type === 'columnMoved') {
      this.columnMovedTo = params.toIndex;
      this.columnMoving = params.column;
    }

    if (
      params.type === 'dragStopped' &&
      this.columnMovedTo &&
      this.columnMoving
    ) {
      console.log('Execute move');

      // Lets find out the origin of the column
      const columns = this.agGrid.columnApi.getAllColumns();
      const originalIndex = columns.indexOf(this.columnMoving);

      this.crudService.reorderColumns(originalIndex, this.columnMovedTo);
      // console.log(columns.indexOf(this.columnMoving));
      // Now flags are cleared to prevent triggering this function when no columns are dragged
      this.columnMoving = null;
      this.columnMovedTo = null;
    }
  }
}

