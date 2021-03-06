const fs = require('fs');
const TableModel = require('../table-model');
const TableView =  require('../table-view');

describe('table-view', () => {

  beforeEach(() => {
    // load the HTML skeleton from disc to parse into the DOM
    const fixturePath = './client/js/test/fixtures/sheet-container.html';
    const html = fs.readFileSync(fixturePath, 'utf8');
    document.documentElement.innerHTML = html;
  });

  describe('formula bar', () => {
    it('it makes changes TO the current cell value', () => {
      // set the initial stat
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      //inspect initial state
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[0].cells[0];
      expect(td.textContent).toBe('');

      // simulate user action
      document.querySelector('#formula-bar').value = '65'
      view.handleFormulaBarChange();

      // inspect the resulting state
      trs = document.querySelectorAll('TBODY TR');
      expect(trs[0].cells[0].textContent).toBe('65');
    });

    it('updates FROM the value of current cell', () => {
      // set the initial stat
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({col: 2, row: 1}, '123');
      view.init();

      //inspect initial state
      const formulaBarEl = document.querySelector('#formula-bar');
      expect(formulaBarEl.value).toBe('');

      // simulate user action
      const trs = document.querySelectorAll('TBODY TR');
      trs[1].cells[2].click();

      // inspect the resulting state
      expect(formulaBarEl.value).toBe('123');
    });
  });

  describe('table body', () => {

    it('highlights the current cell when clicked', () => {
      // set the initial stat
      const model = new TableModel(10, 5);
      const view = new TableView(model);
      view.init();

      // inspect the initial state
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[2].cells[3];
      expect(td.className).toBe('');

      // similute click
      td.click();

      //inspect the resulting state
      trs = document.querySelectorAll('TBODY TR');
      td = trs[2].cells[3];
      expect(td.className).not.toBe('');
    });

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

  describe('table footer', () => {
    it('sums a column of positive numbers', () => {
      // set the initial state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      //inspect initial state
      let footerRow = document.querySelector('TFOOT TR');
      expect(footerRow.cells[1].textContent).toBe('0');

      // simulate user action
      model.setValue({col: 1, row: 0}, '2');
      model.setValue({col: 1, row: 1}, '3');
      model.setValue({col: 1, row: 2}, '5');
      view.renderTableBody();
      view.renderTableFooter();

      // inspect the resulting table state
      let rows = document.querySelectorAll('TBODY TR');
      expect(rows[1].cells[1].textContent).toBe('3');
      view.renderTableFooter();

      // inspect the resulting footer state
      const footerCells = document.querySelectorAll('TFOOT TD');
      expect(footerCells[1].textContent).toBe('10');
    });

    it('sums a column of negative numbers', () => {
      // set the initial stat
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      //inspect initial state
      let footerRow = document.querySelector('TFOOT TR');
      expect(footerRow.cells[1].textContent).toBe('0');

      // simulate user action
      model.setValue({col: 1, row: 0}, '-2');
      model.setValue({col: 1, row: 1}, '-2');
      model.setValue({col: 1, row: 2}, '-5');
      view.renderTableBody();
      view.renderTableFooter();

      // inspect the resulting table state
      let rows = document.querySelectorAll('TBODY TR');
      expect(rows[1].cells[1].textContent).toBe('-2');
      view.renderTableFooter();

      // inspect the resulting state
      const footerCells = document.querySelectorAll('TFOOT TD');
      expect(footerCells[1].textContent).toBe('-9');
    });

    it('sums a column of numbers and ignores cells with strings', () => {
      // set the initial stat
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      //inspect initial state
      let footerRow = document.querySelector('TFOOT TR');
      expect(footerRow.cells[1].textContent).toBe('0');

      // simulate user action
      model.setValue({col: 1, row: 0}, 'apples');
      model.setValue({col: 1, row: 1}, '2');
      model.setValue({col: 1, row: 2}, 'TREES');
      view.renderTableBody();
      view.renderTableFooter();

      // inspect the resulting table state
      let rows = document.querySelectorAll('TBODY TR');
      expect(rows[1].cells[1].textContent).toBe('2');
      expect(rows[0].cells[1].textContent).toBe('apples');
      view.renderTableFooter();

      // inspect the resulting state
      const footerCells = document.querySelectorAll('TFOOT TD');
      expect(footerCells[1].textContent).toBe('2');
    });

    it('sums a column of positive and negative numbers that adds up to 0', () => {
      // set the initial stat
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      //inspect initial state
      let footerRow = document.querySelector('TFOOT TR');
      expect(footerRow.cells[1].textContent).toBe('0');

      // simulate user action
      model.setValue({col: 1, row: 0}, '2');
      model.setValue({col: 1, row: 1}, '2');
      model.setValue({col: 1, row: 2}, '-4');
      view.renderTableBody();
      view.renderTableFooter();

      // inspect the resulting table state
      let rows = document.querySelectorAll('TBODY TR');
      expect(rows[1].cells[1].textContent).toBe('2');
      view.renderTableFooter();

      // inspect the resulting state
      const footerCells = document.querySelectorAll('TFOOT TD');
      expect(footerCells[1].textContent).toBe('0');
    });



  })

});