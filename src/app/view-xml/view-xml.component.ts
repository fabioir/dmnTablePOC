import { Component, OnInit, OnDestroy } from '@angular/core';
import { DmnService } from '../dmn.service';
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
    private dmnService: DmnService
  ) { }

  ngOnInit() {
    console.log(new Date())
   this.keepXMLUpdated();
    this.xmlGenerated = this.dmnService.currentXML; 
    this.dmnService.saveToXML('');
  }

  ngOnDestroy(){
    this.keepUpdated.unsubscribe();
  }

  keepXMLUpdated(){
  
    this.xmlGenerated = this.dmnService.currentXML;

    this.keepUpdated = this.dmnService.getUpdates().subscribe(decisionTable => {
      console.log("Here we are");
      this.xmlGenerated = this.dmnService.currentXML;
    });
  }
}
