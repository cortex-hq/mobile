import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { TestService } from '../shared/services/test.service';
import { ITest } from '../shared/interfaces/iTest';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { AsyncLocalStorage } from 'angular-async-local-storage';

import { SportService } from '../shared/services/cortex.core.sportService';
import { Sport } from '../shared/services/cortex.core.sportServiceProxy';

@Component({
  selector: 'cortex-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss'],
  providers: [
    SportService
  ]
})
export class TestListComponent implements OnInit {

@ViewChild('newSportId') newSportId: ElementRef;
@ViewChild('newSportLabel') newSportLabel: ElementRef;

  tests: Observable<ITest[]>;
  sports: Observable<Sport[]>;

  constructor(private _testService: TestService,
              private _router: Router,
              private _http: Http,
              protected storage: AsyncLocalStorage,
              private sportService: SportService) {
     this.tests =  this._testService.tests;
  }

  ngOnInit() {
    this.sportService.getAllSport<Sport[]>().subscribe(r => {

      console.log(r);

      // if (r.values.filter(s => s.id === 'football').length === 0) {
      //   this.cortexSportService.sportCreate('Football', 'football').subscribe(s => {
      //     console.log(s);
      //   });
      // }
    });

    this.sports = this.sportService.getAllSport().map(p => p.values);
  }

  createSport() {
    const id = this.newSportId.nativeElement.value;
    const label = this.newSportLabel.nativeElement.value;

    this.newSportId.nativeElement.value = this.newSportLabel.nativeElement.value = '';

    this.sportService.sportCreate(label, id).catch((err, c) => {
      console.log(`Error caught`);
      console.log(err);
      return [];
    }).subscribe(s => {
      console.log(s);

      this.sports = this.sportService.getAllSport().map(r => r.values);
    });
  }

  goToTest(id: string) {
    this._router.navigate(['./', id]);
  }

}
