import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicComponent } from '../shared/components/dynamic-component';

import { TestService } from '../shared/services/test.service';
import { ITest } from '../shared/interfaces/iTest';
import { BalanceTestComponent } from '../tests/balance-test/balance-test.component';

@Component({
  selector: 'cortex-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.scss']
})
export class TestDetailsComponent implements OnInit {
  componentData = null;
  testId: string;
  test: ITest;

  constructor(private _route: ActivatedRoute, private _testService: TestService) {

  }

  ngOnInit() {

    this._route.params.subscribe(params => {
      this.testId = params['id'];
      this._testService.tests.subscribe(tests => {
        this.test = tests.filter(t => {
          return t.id === this.testId;
        }).pop();

        // based on context decide how to init componentData
        // map context with target Component and data
        this.componentData = {
          component: BalanceTestComponent,
          inputs: {
            prop1: 123456,
            prop2: 'this is some text',
            prop3: {
              complex: '',
              object: true
            }
          }
        };
      });

    });

  }

}
