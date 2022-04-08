import '@vaadin/vaadin-lumo-styles/spacing.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const dialogOverlay = css`
  /* Optical centering */
  :host::before,
  :host::after {
    content: '';
    flex-basis: 0;
    flex-grow: 1;
  }

  :host::after {
    flex-grow: 1.1;
  }

  [part='overlay'] {
    border-radius: var(--lumo-border-radius-l);
    box-shadow: 0 0 0 1px var(--lumo-shade-5pct), var(--lumo-box-shadow-xl);
    background-image: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  [part='overlay']:focus-visible {
    box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct), 0 0 0 1px var(--lumo-shade-5pct), var(--lumo-box-shadow-xl);
  }

  [part='content'] {
    padding: var(--lumo-space-l);
  }

  :host(:is([has-header], [has-title])) [part='header'] + [part='content'] {
    padding-top: 0;
  }

  [part='header'],
  [part='header-content'],
  [part='footer'] {
    gap: var(--lumo-space-xs) var(--lumo-space-s);
    line-height: var(--lumo-line-height-s);
  }

  :host(:is([has-header], [has-title])) [part='header'] {
    padding: var(--lumo-space-s) var(--lumo-space-m);
    min-height: var(--lumo-size-xl);
    box-sizing: border-box;
    background-color: var(--lumo-base-color);
    border-radius: var(--lumo-border-radius-l) var(--lumo-border-radius-l) 0 0; /* Needed for Safari */
  }

  :host([has-footer]) [part='footer'] {
    padding: var(--lumo-space-s) var(--lumo-space-m);
    min-height: var(--lumo-size-l);
    box-sizing: border-box;
    background-color: var(--lumo-contrast-5pct);
    border-radius: 0 0 var(--lumo-border-radius-l) var(--lumo-border-radius-l); /* Needed for Safari */
  }

  [part='title'] {
    font-size: var(--lumo-font-size-xl);
    font-weight: 600;
    color: var(--lumo-header-text-color);
    margin-inline-start: calc(var(--lumo-space-l) - var(--lumo-space-m));
  }

  /* No padding */
  :host([theme~='no-padding']) [part='content'] {
    padding: 0;
  }

  :host([theme~='no-padding']:is([has-header], [has-title])) [part='header'] {
    padding: 0;
  }

  :host([theme~='no-padding'][has-footer]) [part='footer'] {
    padding: 0;
  }

  @media (min-height: 320px) {
    :host(:is([has-header], [has-title])) [part='header'] {
      box-shadow: 0 1px 0 0 var(--lumo-contrast-10pct);
    }

    /* "scroll divider" */
    :host(:is([has-header], [has-title])) [part='content']::before {
      content: '';
      display: block;
      width: calc(100% + var(--lumo-space-l) * 2);
      height: 200px;
      background: var(--lumo-base-color);
      margin-top: -199px;
      margin-left: calc(var(--lumo-space-l) * -1);
      margin-right: calc(var(--lumo-space-l) * -1);
      position: relative;
      z-index: 1;
    }
  }

  /* Animations */

  :host([opening]),
  :host([closing]) {
    animation: 0.25s lumo-overlay-dummy-animation;
  }

  :host([opening]) [part='overlay'] {
    animation: 0.12s 0.05s vaadin-dialog-enter cubic-bezier(0.215, 0.61, 0.355, 1) both;
  }

  @keyframes vaadin-dialog-enter {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  :host([closing]) [part='overlay'] {
    animation: 0.1s 0.03s vaadin-dialog-exit cubic-bezier(0.55, 0.055, 0.675, 0.19) both;
  }

  :host([closing]) [part='backdrop'] {
    animation-delay: 0.05s;
  }

  @keyframes vaadin-dialog-exit {
    100% {
      opacity: 0;
      transform: scale(1.02);
    }
  }
`;

registerStyles('vaadin-dialog-overlay', [overlay, dialogOverlay], { moduleId: 'lumo-dialog' });
