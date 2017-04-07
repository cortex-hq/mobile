import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppInsightsService } from '@markpieszak/ng-application-insights';
import { AuthService } from './auth.service';

import { Routes, Router } from '@angular/router';

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
  navigationItems: Routes;

  constructor(protected auth: AuthService, private appInsightService: AppInsightsService, private router: Router) {
    this.offline = Observable.merge(
      Observable.of(!navigator.onLine),
      Observable.fromEvent(window, 'online').map(() => false),
      Observable.fromEvent(window, 'offline').map(() => true)
    );

    // appInsightService.init();
    this.navigationItems = this.router.config.filter(r => r.data && r.data['navigable']).sort((a, b) => {
      const value1 = a.data ? a.data['weight'] : 10000;
      const value2 = b.data ? b.data['weight'] : 10000;
      return value1 - value2;
    });

    console.log(this.navigationItems.map(t => t.data['weight']));
  }
}
