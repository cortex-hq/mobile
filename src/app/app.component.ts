import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AppInsightsService } from '@markpieszak/ng-application-insights';

import { AuthService } from './auth.service';

import 'rxjs/Rx';

@Component({
  selector: 'cortex-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ AuthService ]
})
export class AppComponent {
  isDarkTheme = false;
  offline: Observable<boolean>;

  constructor(private auth: AuthService, private router: Router, appInsight: AppInsightsService) {
    this.offline = Observable.merge(
      Observable.of(!navigator.onLine),
      Observable.fromEvent(window, 'online').map(() => false),
      Observable.fromEvent(window, 'offline').map(() => true)
    );

    appInsight.init();
    // this.router.events.subscribe(() => {
    //   AppInsightsService.trackPageView();
    // });
  }
}
