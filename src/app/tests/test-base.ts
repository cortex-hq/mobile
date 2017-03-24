import { AppInsightsService } from '@markpieszak/ng-application-insights';
import { ITest } from '../shared/interfaces/iTest';

export abstract class TestBase {
  test: ITest;
  constructor() {

  }

  protected startTest() {
    AppInsightsService.trackEvent('start-test', {
      id: this.test.id,
      title: this.test.title,
      category: this.test.category,
      type: this.test.type
    });
  }

  protected completeTest(score: number, duration: number) {
    AppInsightsService.trackEvent('start-test', {
      id: this.test.id,
      title: this.test.title,
      category: this.test.category,
      type: this.test.type
    }, {
      score: score,
      duration: duration
    });
  }
}
