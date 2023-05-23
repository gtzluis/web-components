import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync, oneEvent } from '@vaadin/testing-helpers';
import './not-animated-styles.js';
import '../vaadin-context-menu.js';
import { getDeepActiveElement } from '@vaadin/a11y-base/src/focus-utils.js';

describe('a11y', () => {
  describe('focus restoration', () => {
    let contextMenu, button, overlay;

    beforeEach(() => {
      contextMenu = fixtureSync(`
        <vaadin-context-menu open-on="click">
          <button>Open context menu</button>
        </vaadin-context-menu>
      `);
      contextMenu.items = [{ text: 'Menu Item' }];
      button = contextMenu.querySelector('button');
      overlay = contextMenu.$.overlay;
      button.focus();
    });

    it('should move focus to the menu on open', async () => {
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      const menuItem = overlay.querySelector('[role=menuitem]');
      expect(getDeepActiveElement()).to.equal(menuItem);
    });

    it('should restore focus on menu close', async () => {
      button.click();
      await oneEvent(overlay, 'vaadin-overlay-open');
      contextMenu.close();
      await aTimeout(0);
      expect(getDeepActiveElement()).to.equal(button);
    });
  });
});
