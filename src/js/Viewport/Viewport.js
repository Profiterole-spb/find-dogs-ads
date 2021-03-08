import {Container} from "pixi.js/dist/browser/pixi.mjs";
import Core from "src/js/core/Core";

export default class Viewport extends Container {

  static get() {
    if (!this._viewport) {
      this._viewport = new Viewport();
    }
    return this._viewport;
  }

  static get boundWidth() {
    return 1075;
  }

  static get boundHeight() {
    return 767
  }

  static isPortrait() {
    return Core.get().screen.width < Core.get().screen.height * 0.8
  }

  static isLandscape() {
    return !this.isPortrait();
  }

  static get factor() {
    const screen = Core.get().screen
    const widthFactor = screen.width / Viewport.boundWidth;
    const heightFactor = screen.height / Viewport.boundHeight;
    const aspectFactor = (Viewport.boundWidth / 2 / Viewport.boundHeight) / (screen.width / screen.height);
    return this.isPortrait()
      ? Math.max(widthFactor, heightFactor) / aspectFactor
      : Math.min(widthFactor, heightFactor)
  }

  constructor() {
    super();
    Core.get().renderer.on('resize', this.resize, this);
    Core.get().renderer.resize();
  }

  resize() {
    this.scale.set(Viewport.factor);
    this.x = Core.get().screen.width / 2 - Viewport.boundWidth * Viewport.factor / 2 ;
    this.y = Core.get().screen.height / 2 - Viewport.boundHeight * Viewport.factor / 2 ;
  }
}