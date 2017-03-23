import 'gyronorm';

export interface IGyronormData {
  do: { alpha: number, beta: number, gamma: number, absolute: boolean };
  dm: { x: number, y: number, z: number, gx: number, gy: number, gz: number, alpha: number, beta: number, gamma: number };
  computed?: { inclination: number, rotation: number, isFlat?: boolean };
}
export interface IGyronormOptions {
  frequency: number; // ( How often the object sends the values - milliseconds )
  gravityNormalized: boolean; // ( If the garvity related values to be normalized )
  orientationBase: 'world' | 'game'; // ( Can be GyroNorm.GAME or GyroNorm.WORLD.
  // gn.GAME returns orientation values with respect to the head direction of the device.
  // gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
  decimalCount: number; // ( How many digits after the decimal point will there be in the return values )
  logger: (data: any) => void; // ( Function to be called to log messages from gyronorm.js )
  screenAdjusted: boolean; // ( If set to true it will return screen adjusted values. )

}

export interface IGyronorm {
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
}
