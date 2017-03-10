import { CortexMobilePage } from './app.po';

describe('cortex-mobile App', () => {
  let page: CortexMobilePage;

  beforeEach(() => {
    page = new CortexMobilePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
