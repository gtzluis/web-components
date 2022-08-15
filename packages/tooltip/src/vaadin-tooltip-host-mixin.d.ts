/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';

/**
 * A mixin enabling a web component to act as a tooltip host.
 * Any components that extend this mixin are required to import
 * the `vaadin-tooltip` web component using the correct theme.
 */
export declare function TooltipHostMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> & Constructor<TooltipHostMixinClass> & T;

export declare class TooltipHostMixinClass {
  /**
   * String used as a content for the tooltip
   * shown on the element when it gets focus
   * or is hovered using the pointer device.
   * @attr {string} tooltip-text
   */
  tooltipText: string | undefined;
}