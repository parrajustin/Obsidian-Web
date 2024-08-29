import { Component } from "../component";

/**
 * @public
 */
export enum PopoverState {

}

/**
 * @public
 */
export class HoverPopover extends Component {

  /**
   * @public
   */
  hoverEl: HTMLElement;
  /**
   * @public
   */
  state: PopoverState;

  /**
   * @public
   */
  constructor(parent: HoverPopover, targetEl: HTMLElement | null, waitTime?: number);

}
