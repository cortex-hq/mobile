import {Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

import { ITest } from '../interfaces/iTest';
import { testData } from './../data';

@Injectable()
export class TestService {
  tests: Observable<ITest[]>;

  private _tests: BehaviorSubject<ITest[]>;
  private _store: { tests: ITest[] };

  // wrapping as Observable as this will be handled by api calls
  constructor() {
    this._store = { tests: testData };
    this._tests = new BehaviorSubject(Object.assign({}, this._store).tests);
    this.tests = this._tests.asObservable().map(ts => ts.map(t => this.setTest(t)));
  }

  private setTest(test: ITest) {
    return test;
  }
}
