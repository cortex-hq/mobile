import { Component, OnInit } from '@angular/core';
import { TestService } from '../shared/services/test.service';
import { ITest } from '../shared/interfaces/iTest';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'cortex-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit {
  tests: Observable<ITest[]>;

  constructor(private _testService: TestService, private router: Router) {
     this.tests =  this._testService.tests;
  }

  ngOnInit() {
  }

  goToTest(id: string) {
    this.router.navigate(['./', id]);
  }

}
