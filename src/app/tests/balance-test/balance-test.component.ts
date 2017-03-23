import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { IGyronormData, IGyronorm, IGyronormOptions } from '../gyro';

declare var GyroNorm: any;
// TODO: extract as a service and abstracts away interaction to switch easily to another implementation


@Component({
  selector: 'cortex-balance-test',
  templateUrl: './balance-test.component.html',
  styleUrls: ['./balance-test.component.scss']
})
export class BalanceTestComponent implements OnInit, OnDestroy, AfterViewInit {
  static readonly gyroFrequencyMs = 50;

  // movementData: Observable<{ x: number, y: number, z: number, angleFromFlat: number }>;
  movementData: Observable<IGyronormData>;
  // movementDataSubscription: Subscription;
  normalizedGyro: IGyronorm;
  data: IGyronormData;

  context: CanvasRenderingContext2D;

  _height: number;
  _width: number;
  _defaultSize = 100;

  _testDuration = 15000; // test duration in ms
  _countDown = 0;
  _durationLevel = 0;

  _testing: boolean;

  private _centerX: number;
  private _centerY: number;
  private _radius: number;
  private _isHorizontal: boolean;
  private _timeAtZero: number;
  private _zeroTransitionTime = 15;
  private _zeroColor = 'green';

  @ViewChild('spiritLevel') spiritLevel: ElementRef;

  constructor() {
    this._width = window.outerWidth * window.devicePixelRatio * .9;
    this._height = window.outerHeight * window.devicePixelRatio * .9;

    this._testing = false;
  }

  start() {
    this._testing = true;

    this._durationLevel = 0;
    this._countDown = this._testDuration;

    if (this.spiritLevel.nativeElement.requestFullscreen) {
      this.spiritLevel.nativeElement.requestFullscreen();
    } else if (this.spiritLevel.nativeElement.mozRequestFullScreen) {
      this.spiritLevel.nativeElement.mozRequestFullScreen();
    } else if (this.spiritLevel.nativeElement.webkitRequestFullscreen) {
      this.spiritLevel.nativeElement.webkitRequestFullscreen();
    } else if (this.spiritLevel.nativeElement.msRequestFullscreen) {
      this.spiritLevel.nativeElement.msRequestFullscreen();
    } else {
      throw new Error(`no api found to get to full screen`);
    }


    // lock orientation to portrait
    (<any>window.screen).orientation.lock('portrait').then(r => {
      console.log(r);
    });

    const subscription = this.movementData.subscribe(data => {
      this.draw(data);
      console.log(`Compass heading: ${data.do.alpha}`);
    });

    // count down
    const countdown = Observable.timer(1000, 1000).subscribe(() => {
      this._countDown -= 1000;
    });

    // triggers when test duration is over
    Observable.timer(this._testDuration).subscribe(() => {
      const doc = <any>document;
      // timer ellapsed exit fullscreen mode
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      } else {
        throw new Error(`no api found to exit full screen`);
      }
      if (countdown) {
        countdown.unsubscribe();
      }
    });

    // react to fullscreen off
    Observable.merge(
      Observable.fromEvent(window, 'fullscreenchange'),
      Observable.fromEvent(window, 'mozfullscreenchange'),
      Observable.fromEvent(window, 'webkitfullscreenchange')
    ).map((data) => {
      return (document.fullscreenElement ||
        document.webkitFullscreenElement ||
        (<any>document).mozFullScreenElement ||
        (<any>document).msFullscreenElement) ? true : false;
    })
      .filter(d => !d) // only interested in fullscreen-off event
      .subscribe((d: boolean) => {
        console.log(`subscribed: ${d}`);
        this._testing = false;
        subscription.unsubscribe();
      });
  }

  ngAfterViewInit() {
    if (!window.orientation) {
      console.log('orientation not supported');
    }

    // setup canvas
    this.context = this.spiritLevel.nativeElement.getContext('2d');

    this.context.font = '100 100pt "Helvetica Neue"';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';

    this.context.globalCompositeOperation = 'source-over';
    this._centerX = this._width / 2;
    this._centerY = this._height / 2;
    this._radius = Math.min(this._width, this._height) * .15;
    this._isHorizontal = Math.abs(<number>window.orientation) === 90;

  }

  private draw(data: IGyronormData) {
    return new Promise((resolve, reject) => {
      let x: number = data.do.beta;
      let y: number = data.do.gamma;
      const z: number = data.do.alpha;
      const angle = Math.round(Math.sqrt(Math.pow(y, 2) + Math.pow(x, 2)));

      // fix angle if device is rotated
      if (this._isHorizontal) {
        const xPrime = y;
        y = x;
        x = xPrime;

        if (<number>window.orientation === 90) {
          x = -x;
          y = -y;
        }
      }

      let x1: number, x2: number, y1: number, y2: number;

      this.context.fillStyle = 'black';
      this.context.fillRect(0, 0, this._width, this._height);

      // if we are withing x degrees, snap to _zeroColor
      // if (angle === 0) {
      if (angle <= 1) {
        if (this._timeAtZero < 0) {
          this._timeAtZero = 0;
          this._durationLevel = 0;
        } else {
          this._timeAtZero++;
          this._timeAtZero = Math.min(this._timeAtZero, this._zeroTransitionTime);
          this._durationLevel += BalanceTestComponent.gyroFrequencyMs / 1000;
        }

        x1 = x2 = y1 = y2 = 0;

      } else {
        if (this._timeAtZero > this._zeroTransitionTime) {
          this._timeAtZero = this._zeroTransitionTime;
        } else {
          this._timeAtZero--;
          this._timeAtZero = Math.max(this._timeAtZero, 0);
        }

        x1 = (y / 30) * this._width;
        x2 = -x1;

        y1 = (x / 70) * this._height;
        y2 = -y1;
      }

      const isZero = [x1, x2, y1, y2, angle].reduce((a, b) => (a === b) ? a : NaN) === 0;
      // console.log(`isZero: ${isZero}`);
      // clear
      this.context.globalCompositeOperation = 'source-over';
      this.context.fillStyle = isZero ? this._zeroColor : 'black';
      this.context.fillRect(0, 0, this._width, this._height);

      if (!isZero) {
        this.context.globalCompositeOperation = 'difference';
      }

      // compute circle positions
      const circle1CenterX = this._centerX + x1;
      const circle1CenterY = this._centerY + y1;
      const circle2CenterX = this._centerX + x2;
      const circle2CenterY = this._centerY + y2;

      // circle 1
      this.context.beginPath();
      this.context.arc(circle1CenterX, circle1CenterY, this._radius + 5, 0, Math.PI * 2);
      this.context.fillStyle = 'white';
      this.context.fill();
      this.context.closePath();

      // circle 2
      this.context.beginPath();
      this.context.arc(circle2CenterX, circle2CenterY, this._radius, 0, Math.PI * 2);
      this.context.fillStyle = isZero ? this._zeroColor : 'white';
      this.context.fill();
      this.context.closePath();

      const halfWidth = this._width / 2;
      const halfHeight = this._height / 2;

      // draw angular measure text
      this.context.fillStyle = 'white';
      // this.context.translate(halfWidth, halfHeight);
      // // rotate text here
      // this.context.translate(-halfWidth, -halfHeight);
      this.context.fillText(`${angle}°`, halfWidth, halfHeight);
      // this.context.translate(halfWidth, halfHeight);
      // // rotate text here
      // this.context.translate(-halfWidth, -halfHeight);

      // draw duration level text

      // this.context.fillStyle = 'white';
      this.context.fillText(`${Math.round(this._durationLevel)} sec`,
        halfWidth,
        this._height / 4);

      this.context.fillText(`${Math.round(this._countDown / 1000)} sec`,
        halfWidth,
        this._height * 3 / 4);

      resolve();
    });
  }

  ngOnInit() {
    this.normalizedGyro = new GyroNorm();

    this.movementData = Observable.create(observer => {
      // initialize gyro data
      this.normalizedGyro.init({
        frequency: BalanceTestComponent.gyroFrequencyMs,
        gravityNormalized: true,
        orientationBase: 'world',
        decimalCount: 2,
        logger: null,
        screenAdjusted: true
      }).then(() => {

        this.normalizedGyro.start((data) => {
          // console.log(`o alpha: ${data.do.alpha} o beta: ${data.do.beta} o gamma: ${data.do.gamma} o absolute: ${data.do.absolute}`);
          // console.log(`m alpha: ${data.dm.alpha} m beta: ${data.dm.beta} m gamma: ${data.dm.gamma}`);
          // console.log(`      x: ${data.dm.x}          y: ${data.dm.y}          z: ${data.dm.z}`);
          observer.next(data);

        });
      });
    });
  }

  ngOnDestroy() {
    if (this.normalizedGyro && this.normalizedGyro.isRunning()) {
      this.normalizedGyro.end();
    }

    // unlock orientation to portrait
    (<any>window.screen).orientation.unlock();
  }

}
