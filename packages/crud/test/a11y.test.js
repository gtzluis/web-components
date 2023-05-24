import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../src/vaadin-crud.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('a11y', () => {
  let crud;

  describe('focus restoration', () => {
    let newButton, overlay;

    beforeEach(async () => {
      crud = fixtureSync('<vaadin-crud style="width: 300px;"></vaadin-crud>');
      crud.items = [{ name: 'John' }];
      overlay = crud.$.dialog.$.overlay;
      newButton = crud.querySelector('[slot=new-button]');
      newButton.focus();
      await nextRender();
    });

    it('should move focus to the dialog on open', async () => {
      newButton.click();
      await nextRender();
      expect(getDeepActiveElement()).to.equal(overlay.$.overlay);
    });

    it('should restore focus on dialog close', async () => {
      newButton.click();
      await nextRender();
      await sendKeys({ press: 'Escape' });
      await nextRender();
      expect(getDeepActiveElement()).to.equal(newButton);
    });
  });
});
