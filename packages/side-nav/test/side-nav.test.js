import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../enable.js';
import '../vaadin-side-nav.js';

describe('side-nav', () => {
  let sideNav;

  beforeEach(() => {
    sideNav = fixtureSync(`
      <vaadin-side-nav collapsible>
        <span slot="label">Main menu</span>
        <vaadin-side-nav-item>Item 1</vaadin-side-nav-item>
        <vaadin-side-nav-item>Item 2</vaadin-side-nav-item>
      </vaadin-side-nav>
    `);
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = sideNav.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('collapsing', () => {
    it('should dispatch collapsed-changed event when collapsed changes', async () => {
      const spy = sinon.spy();
      sideNav.addEventListener('collapsed-changed', spy);
      await nextRender(sideNav);
      sideNav.shadowRoot.querySelector('summary[part="label"]').click();
      expect(spy.calledOnce).to.be.true;
    });
  });
});
