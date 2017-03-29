import { AppInsightsService } from '@markpieszak/ng-application-insights';
import { ITest } from '../shared/interfaces/iTest';

export abstract class TestBase {
  static readonly TEST_IN_PROGRESS = 'TEST-IN-PROGRESS';

  test: ITest;
  constructor(protected appInsights: AppInsightsService) {

  }

  protected startTest() {
    this.appInsights.startTrackEvent(TestBase.TEST_IN_PROGRESS);
  }

  protected completeTest(score: number, duration: number) {
    this.appInsights.stopTrackEvent(TestBase.TEST_IN_PROGRESS, {
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
