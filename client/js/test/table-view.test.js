const fs = require('fs');
const TableModel = require('../table-model');
const TableView =  require('../table-view');

describe('table-view', () => {

  beforeEach(() => {
    // load the HTML skeleton from disc to parse into the DOM
    const fixurePath = './client/js/test/fixtures/sheet-container.html';
    const html = fs.readFileSync(fixurePath, 'utf8');
    document.documentElement.innerHTML = html;
  });

  describe('table header', () => {
    it('has valid column header labels', () => {
      // set up initial state
      const numCols = 6;
      const numRows = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();

      // inspect the initial state
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toEqual(numCols);

      let lableTexts = Array.from(ths).map(el => el.textContent);
      expect(lableTexts).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    });

  });

});