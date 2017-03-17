import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable,  } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'cortex-balance-test',
  templateUrl: './balance-test.component.html',
  styleUrls: ['./balance-test.component.scss']
})
export class BalanceTestComponent implements OnInit, OnDestroy {
  movementData: Observable<{x: number, y: number, z: number, angleFromFlat: number}>;
  movementDataSubscription: Subscription;

  constructor() {

  }

  ngOnInit() {
    if (!window.orientation) {
      console.log(`does not support orientation`);
      return;
    }

     this.movementData = Observable.fromEvent(window, 'deviceorientation').map((e: DeviceOrientationEvent) => {
        return {
          x: e.beta,
          y: e.gamma,
          z: e.alpha,
          angleFromFlat: Math.round(Math.sqrt(Math.pow(e.gamma, 2) + Math.pow(e.beta, 2)))
        };
      });

      this.movementData.subscribe(d => {
        console.log(d);
      });
  }

  ngOnDestroy() {
    if (this.movementDataSubscription) {
      setTimeout(() => this.movementDataSubscription.unsubscribe(), 0);
    }
  }

}
