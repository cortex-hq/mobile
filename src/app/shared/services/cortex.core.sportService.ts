import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AsyncLocalStorage } from 'angular-async-local-storage';

import { CortexCoreSportServiceService } from './cortex.core.sportServiceProxy';

@Injectable()
export class SportService extends CortexCoreSportServiceService {
  constructor(http: Http, storage: AsyncLocalStorage) {
    super(http, storage);
  }

}
