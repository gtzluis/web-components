/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { htmlLiteral } from '@polymer/polymer/lib/utils/html-tag.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { VirtualListMixin } from './vaadin-virtual-list-mixin.js';

/**
 * `<vaadin-virtual-list>` is a Web Component for displaying a virtual/infinite list of items.
 *
 * ```html
 * <vaadin-virtual-list></vaadin-virtual-list>
 * ```
 *
 * ```js
 * const list = document.querySelector('vaadin-virtual-list');
 * list.items = items; // An array of data items
 * list.renderer = (root, list, {item, index}) => {
 *   root.textContent = `#${index}: ${item.name}`
 * }
 * ```
 *
 * See [Virtual List](https://vaadin.com/docs/latest/ds/components/virtual-list) documentation.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class VirtualList extends VirtualListMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        ${htmlLiteral([super.styles.cssText])}
      </style>

      <div id="items">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define(VirtualList.is, VirtualList);

export { VirtualList };
