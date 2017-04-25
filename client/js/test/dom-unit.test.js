const { createTR,
        createTH,
        createTD,
        removeChild } = require('../dom-util');

describe('dom-util', () => {

  describe('DOM creation functions', () => {
    describe('createTH', () => {
      it('produces valid TH element', () => {
        const el = createTH();
        expect(el.tagName).toBe('TH');
      });
    });

    describe('createTR', () => {
      it('produces valid TR element', () => {
        const el = createTR();
        expect(el.tagName).toBe('TR');
      });
    });

    describe('createTD', () => {
      it('produces valid TD element', () => {
        const el = createTD();
        expect(el.tagName).toBe('TD');
      });
    });
  });

  describe('removeChildren()', () => {
    it('remove one child', () => {
        // set up initial state
        const parent = document.createElement('DIV');
        const child = document.createElement('STRONG');
        parent.appendChild(child);

        // inspect initial state
        expect(parent.childNodes.length).toBe(1);
        expect(parent.childNodes[0]).toBe(child);

        // execute code under test
        removeChild(parent);

        // inspect resulting state
        expect(parent.childNodes.length).toBe(0);
      });
  }); 
});