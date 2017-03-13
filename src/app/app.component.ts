import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';

@Component({
  selector: 'cortex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isDarkTheme = false;
  offline: Observable<boolean>;

  constructor() {
    this.offline = Observable.merge(
      Observable.of(!navigator.onLine),
      Observable.fromEvent(window, 'online').map(() => false),
      Observable.fromEvent(window, 'offline').map(() => true)
    );
  }
}
