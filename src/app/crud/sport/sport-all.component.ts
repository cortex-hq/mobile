import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SportService } from '../../shared/services/cortex.core.sportService';
import { Sport } from '../../shared/services/cortex.core.sportServiceProxy';

@Component({
  selector: 'cortex-sport-all',
  templateUrl: './sport-all.component.html',
  styleUrls: [
    './sport-all.component.scss'
  ],
  providers: [
    SportService
  ]
})
export class SportallComponent implements OnInit, AfterViewInit {
    sports: Sport[];

    constructor(private service: SportService) {

    }
    ngOnInit() {
      this.service.getAllSport().subscribe(sports => this.sports = <Sport[]>sports.values);
    }

    ngAfterViewInit() {

    }
}
