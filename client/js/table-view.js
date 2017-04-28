const { getLetterRange } = require('./array-util');
const { createTH, createTR, createTD, removeChildren } = require('./dom-util');

class TableView {
  constructor(model) {
    this.model = model;
  }

  init() {
    this.initDomReferences();
    this.initCurrentCell();
    this.renderTable();
    this.attachEventHandlers();
  }

  initDomReferences() {
    this.headerRowEl = document.querySelector('THEAD TR');
    this.sheetBodyEl = document.querySelector('TBODY');
    this.formulaBarEl = document.querySelector('#formula-bar');
    this.sumRowEl = document.querySelector('TFOOT');
  }

  initCurrentCell() {
    this.currentCellLocation = {col: 0, row: 0};
    this.renderFormulaBar();
  }

  normalizeValueForRendering(value) {
    return value || '';
  }

  renderFormulaBar() {
    const currentCellLocation = this.model.getValue(this.currentCellLocation);
    this.formulaBarEl.value = this.normalizeValueForRendering(currentCellLocation);
    this.formulaBarEl.focus();
  }

  renderTable() {
    this.renderTableHeader();
    this.renderTableBody();
    this.renderSumRow();
  }

  renderTableHeader() {
    removeChildren(this.headerRowEl);
    getLetterRange('A', this.model.numCols)
      .map(colLabel => createTH(colLabel))
      .forEach(th => this.headerRowEl.appendChild(th));
  }

  isCurrentCell(col, row) {
    return this.currentCellLocation.col === col && this.currentCellLocation.row === row;
  }

  renderTableBody() {
    const fragment = document.createDocumentFragment();
    for (let row = 0; row < this.model.numRows; row++) {
      const tr = createTR();
      for (let col = 0; col < this.model.numCols; col++) {
        const position = {col: col, row: row};
        const value = this.model.getValue(position);
        const td = createTD(value);

        if(this.isCurrentCell(col, row)) {
          td.className = 'current-cell';
        }

        tr.appendChild(td);
      }
      fragment.appendChild(tr);
    }
    removeChildren(this.sheetBodyEl);
    this.sheetBodyEl.appendChild(fragment);
  }

  renderSumRow() {
    // for each column iterate down the rows if a cell is empty ignore, 
    // get column row locations using this.model.getValue(position)
    // if it has a value push that value to an array
    // reduce that array and push total to sum row for that column. 
    // repeat for each column 
    console.log("start");
    let sums = [];
    
    for (let col = 0; col < this.model.numCols; col++) {
      let columnValues = [];
      for (let row = 0; row < this.model.numRows; row++) {
        let position = {col: col, row: row};
        let value = this.model.getValue(position);
        //console.log(value);
        if(isNaN(value)) {
          
        } else {
          columnValues.push(parseInt(value));
        }
        console.log('column values: ' + columnValues);
      }

      const columnSum = columnValues.reduce(function(a, b) { return a + b; }, 0);
      sums.push(columnSum);
      console.log('column sum: ' + columnSum);

    }
   
    console.log('sums: ' + sums);

    const fragment = document.createDocumentFragment();
    const tr = createTR();
    for (let col = 0; col < this.model.numCols; col++) {
      const td = createTD(sums[col]);
      tr.appendChild(td);
    }

    fragment.appendChild(tr);
    removeChildren(this.sumRowEl);
    this.sumRowEl.appendChild(fragment);

   // //trash
   //  const fragment = document.createDocumentFragment();
   //  const tr = createTR();
   //  for (let col = 0; col < this.model.numCols; col++) {
   //    const row = 20;
   //    const sumPosition = {col: col, row: row};
   //    //console.log(sumPosition);
   //    const sumValue = this.model.getValue(sumPosition);
   //    console.log(sumValue);

   //    const currentPosition = this.currentCellLocation
   //    //console.log(currentPosition);

   //    const currentValue = this.formulaBarEl.value;
   //    //console.log('current value: ' + currentValue);

   //    const td = createTD(currentValue);
   //    tr.appendChild(td);

   //    // if(col === this.currentCellLocation.col) {
   //    //   const td = createTD(sumValue + currentValue);
   //    //   tr.appendChild(td)
   //    // } else {
   //    //   const td = createTD(sumValue);
   //    //   tr.appendChild(td)
   //    // }
   // fragment.appendChild(tr);
   //  removeChildren(this.sumRowEl);
   //  this.sumRowEl.appendChild(fragment);

    
  }

  attachEventHandlers() {
    this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this));
    this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this));
  }

  handleFormulaBarChange(evt) {
    const value = this.formulaBarEl.value;
    this.model.setValue(this.currentCellLocation, value);
    this.renderTableBody();
    this.renderSumRow();
  }

  handleSheetClick(evt) {
    const col = evt.target.cellIndex;
    const row = evt.target.parentElement.rowIndex - 1;

    this.currentCellLocation = { col: col, row: row };
    this.renderTableBody();
    this.renderFormulaBar();
  }

} 

module.exports = TableView;