import { ThreejsPage } from './app.po';

describe('threejs App', () => {
  let page: ThreejsPage;

  beforeEach(() => {
    page = new ThreejsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
