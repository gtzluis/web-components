import '@vaadin/vaadin-material-styles/color.js';
import '@vaadin/vaadin-material-styles/typography.js';
import '@vaadin/vaadin-material-styles/shadow.js';
import '@vaadin/vaadin-material-styles/style.js';
import '@vaadin/vaadin-material-styles/font-icons.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export const sideNavItemStyles = css`
  :host {
    display: block;
  }

  [hidden] {
    display: none !important;
  }

  a {
    flex: auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    text-decoration: none;
    color: inherit;
    font: inherit;
    padding: 8px 4px;
    padding-inline-start: calc(0.5rem + var(--_child-indent, 0px));
    border-radius: 4px;
    transition: color 140ms;
    cursor: default;
    min-height: 18px;
  }

  button {
    -webkit-appearance: none;
    appearance: none;
    border: 0;
    margin: 0;
    margin-inline-end: -4px;
    padding: 0;
    background: transparent;
    font: inherit;
    color: var(--material-secondary-text-color);
    flex: none;
    width: 1.875rem;
    height: 1.875rem;
    cursor: default;
    transition: color 140ms;
  }

  :host(:not([path])) a {
    position: relative;
  }

  :host(:not([path])) button::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  @media (any-hover: hover) {
    a:hover {
      color: var(--material-body-text-color);
    }

    button:hover {
      color: var(--material-body-text-color);
    }
  }

  a:active:focus {
    background-color: var(--material-secondary-background-color);
  }

  button::before {
    font-family: material-icons;
    content: var(--material-icons-dropdown);
    font-size: 1.5em;
    line-height: 1.875rem;
    display: inline-block;
    transform: rotate(-90deg);
    transition: transform 140ms;
  }

  :host([expanded]) button::before {
    transform: none;
  }

  @supports selector(:focus-visible) {
    a,
    button {
      outline: none;
    }

    a:focus-visible,
    button:focus-visible {
      border-radius: 4px;
      box-shadow: none;
    }
  }

  a:active {
    color: var(--material-body-text-color);
  }

  slot[name='prefix'],
  slot[name='suffix'] {
    flex: none;
  }

  slot:not([name]) {
    display: block;
    flex: auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 0.25rem;
  }

  slot[name='prefix']::slotted(:is(vaadin-icon, [class*='icon'])) {
    color: var(--material-secondary-text-color);
  }

  :host([active]) slot[name='prefix']::slotted(:is(vaadin-icon, [class*='icon'])) {
    color: inherit;
  }

  slot[name='children'] {
    --_child-indent: calc(var(--_child-indent-2, 0px) + var(--vaadin-side-nav-child-indent, 1.5rem));
  }

  slot[name='children']::slotted(*) {
    --_child-indent-2: var(--_child-indent);
  }

  slot[name='children'] {
    /* Needed to make role="list" work */
    display: block;
    width: 100%;
  }

  :host([active]) a {
    color: var(--material-secondary-text-color);
    background-color: var(--material-secondary-background-color);
  }
`;

registerStyles('vaadin-side-nav-item', sideNavItemStyles, { moduleId: 'material-side-nav-item' });

export const sideNavStyles = css`
  :host {
    display: block;
    font-family: var(--material-font-family);
    font-size: var(--material-small-font-size);
    font-weight: 500;
    line-height: 1.2;
    color: var(--material-body-text-color);
    -webkit-tap-highlight-color: transparent;
  }

  [hidden] {
    display: none !important;
  }

  summary {
    cursor: default;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
  }

  summary ::slotted([slot='label']) {
    display: block;
    font-size: var(--material-caption-font-size);
    color: var(--material-secondary-text-color);
    margin: 0.5em;
    border-radius: inherit;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  summary::marker {
    content: '';
  }

  summary::after {
    font-family: material-icons;
    color: var(--material-secondary-text-color);
    font-size: 1.5em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.875rem;
    height: 1.875rem;
    transition: transform 140ms;
    margin: 0 4px;
  }

  :host([collapsible]) summary::after {
    content: var(--material-icons-dropdown);
  }

  @media (any-hover: hover) {
    summary:hover::after {
      color: var(--material-body-text-color);
    }
  }

  :host([collapsed]) summary::after {
    transform: rotate(-90deg);
  }

  @supports selector(:focus-visible) {
    summary {
      outline: none;
    }

    summary:focus-visible {
      box-shadow: 0 0 0 2px var(--material-primary-color);
    }
  }

  slot {
    /* Needed to make role="list" work */
    display: block;
  }
`;

registerStyles('vaadin-side-nav', sideNavStyles, { moduleId: 'material-side-nav' });
