import { Component, OnInit, OnDestroy } from '@angular/core';
import { DmnService } from '../dmn.service';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-xml',
  templateUrl: './view-xml.component.html',
  styleUrls: ['./view-xml.component.css']
})
export class ViewXmlComponent implements OnInit, OnDestroy {

  xmlGenerated = 'test';
  keepUpdated: Subscription;

  constructor(
    private dmnService: DmnService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    console.log(new Date())
    this.keepXMLUpdated();
  }

  ngOnDestroy() {
    this.keepUpdated.unsubscribe();
  }

  keepXMLUpdated() {

    if (this.dataService.xml) {
      this.xmlGenerated = this.dataService.xml;
    }

    this.keepUpdated = this.dataService.getXMLUpdates().subscribe(xml => {
      console.log("Here we are");
      this.xmlGenerated = xml;
    });
  }

  showIt(){
    console.log(this.dataService.table)
  }
}
