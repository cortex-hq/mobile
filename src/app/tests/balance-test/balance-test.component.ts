import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'gyronorm';

// TODO: extract as a service and abstracts away interaction to switch easily to another implementation
declare var GyroNorm: any;

interface IGyronormData {
  do: { alpha: number, beta: number, gamma: number, absolute: boolean };
  dm: { x: number, y: number, z: number, gx: number, gy: number, gz: number, alpha: number, beta: number, gamma: number };
  computed?: { inclination: number, rotation: number, isFlat?: boolean };
}
interface IGyronormOptions {
  frequency: number; // ( How often the object sends the values - milliseconds )
  gravityNormalized: boolean; // ( If the garvity related values to be normalized )
  orientationBase: 'world' | 'game'; // ( Can be GyroNorm.GAME or GyroNorm.WORLD.
  // gn.GAME returns orientation values with respect to the head direction of the device.
  // gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
  decimalCount: number; // ( How many digits after the decimal point will there be in the return values )
  logger: (data: any) => void; // ( Function to be called to log messages from gyronorm.js )
  screenAdjusted: boolean; // ( If set to true it will return screen adjusted values. )

}

interface IGyronorm {
  end();
  init(option: IGyronormOptions);
  isAvailable(type: 'deviceorientation' | 'acceleration' | 'accelerationinludinggravity' | 'rotationrate'): boolean;
  isRunning(): boolean;
  normalizeGravity(flag: boolean);
  setHeadDirection(): boolean;
  start(callback: (data: IGyronormData) => void);
  stop();
  startLogging(logger: (data: any) => void);
  stopLogging();
};


@Component({
  selector: 'cortex-balance-test',
  templateUrl: './balance-test.component.html',
  styleUrls: ['./balance-test.component.scss']
})
export class BalanceTestComponent implements OnInit, OnDestroy, AfterViewInit {
  // movementData: Observable<{ x: number, y: number, z: number, angleFromFlat: number }>;
  movementData: Observable<IGyronormData>;
  // movementDataSubscription: Subscription;
  normalizedGyro: IGyronorm;
  data: IGyronormData;

  context: CanvasRenderingContext2D;

  _height: number;
  _width: number;

  private _centerX: number;
  private _centerY: number;
  private _radius: number;
  private _isHorizontal: boolean;
  private _timeAtZero: number;
  private _zeroTransitionTime = 15;
  private _zeroColor = 'green';

  @ViewChild('spiritLevel') spiritLevel: ElementRef;

  constructor() {
  }

  start() {
    this._width = window.outerWidth * window.devicePixelRatio * .75;
    this._height = window.outerHeight * window.devicePixelRatio * .75;

    // TODO: subscribe to fullscreen exit and unsubscribe to movementdata observer
    this.spiritLevel.nativeElement.webkitRequestFullScreen();
    // lock orientation to portrait
    (<any>window.screen).orientation.lock('portrait').then(r => {
      console.log(r);
    });

    const subscription = this.movementData.subscribe(data => {
      this.draw(data);
      console.log(`Compass heading: ${data.do.alpha}`);
    });

    Observable.merge(
      Observable.fromEvent(window, 'fullscreenchange'),
      Observable.fromEvent(window, 'mozfullscreenchange'),
      Observable.fromEvent(window, 'webkitfullscreenchange')
    ).map(() => {
      return (document.fullscreenElement ||
              document.webkitFullscreenElement ||
              (<any>document).mozFullScreenElement ||
              (<any>document).msFullscreenElement) ? true : false;
    })
    .filter(d => !d) // only interested in fullscreen-off event
    .subscribe((d: boolean) => {
      console.log(`subscribed: ${d}`);
          this._height = 0;
          this._width = 0;

          subscription.unsubscribe();
    });
  }

  ngAfterViewInit() {
    if (!window.orientation) {
      console.log('orientation not supported');
    }

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
      // console.log(`o alpha: ${data.do.alpha} o beta: ${data.do.beta} o gamma: ${data.do.gamma} o absolute: ${data.do.absolute}` );
      // console.log(`m alpha: ${data.dm.alpha} m beta: ${data.dm.beta} m gamma: ${data.dm.gamma}` );
      // console.log(`      x: ${data.dm.x}          y: ${data.dm.y}          z: ${data.dm.z}` );
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
      if (angle === 0) {
        if (this._timeAtZero < 0) {
          this._timeAtZero = 0;
        } else {
          this._timeAtZero++;
          this._timeAtZero = Math.min(this._timeAtZero, this._zeroTransitionTime);
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

      const isZero = [ x1, x2, y1, y2, angle ].reduce((a, b) => (a === b) ? a : NaN) === 0;
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

      this.context.fillStyle = 'white';
      this.context.translate(halfWidth, halfHeight);
      this.context.translate(-halfWidth, -halfHeight);
      this.context.fillText(`${angle}°`, halfWidth, halfHeight);
      this.context.translate(halfWidth, halfHeight);
      this.context.translate(-halfWidth, -halfHeight);

      resolve();
    });
  }

  ngOnInit() {
    this.normalizedGyro = new GyroNorm();

    this.movementData = Observable.create(observer => {
      // initialize gyro data
      this.normalizedGyro.init({
        frequency: 50,
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
