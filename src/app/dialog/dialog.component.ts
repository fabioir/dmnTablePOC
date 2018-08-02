import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  newValue: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

  ngOnInit() {
    // console.log(this.data.valueOf());
    const offsetX = this.data.event.pageX;
    const offsetY = this.data.event.pageY;
    console.log(`${offsetX} ${offsetY}`);
    this.dialogRef.updatePosition({top: `${offsetY}px`, left: `${offsetX}px`});
    // console.log(this.data.set('value', this.newValue));
  }

  close() {
    this.dialogRef.close(this.newValue);
  }
}
