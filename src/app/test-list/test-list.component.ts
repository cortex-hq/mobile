import { Component, OnInit } from '@angular/core';
import { TestService } from '../shared/services/test.service';
import { ITest } from '../shared/interfaces/iTest';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cortex-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {
  tests: Observable<ITest[]>;

  constructor(private _testService: TestService) {
     this.tests =  this._testService.tests;
  }

  ngOnInit() {
  }

}
