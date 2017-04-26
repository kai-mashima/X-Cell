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

  describe('table body', () => {
    it('has the right size', () => {
      // set the initial state
      const numCols = 6;
      const numRows = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();

      // inspect the initial state
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toEqual(numCols);
    });

    it('fills in values from model', () => {
      // set the initial state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({col: 2, row: 1}, '123');
      view.init();

      // inspect the initial state
      let trs = document.querySelectorAll('TBODY TR');
      expect(trs[1].cells[2].textContent).toBe('123');
    });
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