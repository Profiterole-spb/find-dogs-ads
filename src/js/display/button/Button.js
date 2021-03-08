import {Sprite, Text} from "pixi.js/dist/browser/pixi.mjs";
import Tweener from "src/js/utils/Tweener";
import {preloadPack} from "src/js/display/preloadPack/preloadPack";
import Core from "src/js/core/Core";
import Viewport from "src/js/Viewport/Viewport";


export class Button extends Sprite {

  static get() {
    if (!this._btn) {
      this._btn = new Button();
    }
    return this._btn;
  }

  constructor() {
    super(Core.getTexture(preloadPack.button));
    this.interactive = true;
    this.buttonMode = true;
    this.on('pointerup', () => {
      document.location.href = "https://github.com/Profiterole-spb/find-dogs-ads";
    });
    this._caption = new Text(
      'Play Now',
      {fontFamily: 'Arial', fontSize: 40, fill: 0xffffff, align: 'center', fontWeight: 'bold'}
    );
    this._caption.anchor.set(0.5);
    this.anchor.set(0.5);
    this.addChild(this._caption);
    Core.get().renderer.on('resize', this.resize, this);
  }

  resize() {
    this.x = Viewport.boundWidth / 2;
    this.y = Viewport.boundHeight - this.height / 2 - 20;
  }

  blink() {
    const target = {angle: 0};
    const tweener = new Tweener(target);
    tweener.onTick = () => {
      this.scale.set(1 + 0.1 * Math.abs(Math.sin(target.angle)))
    };
    tweener.asyncTo({angle: 2 * Math.PI}, 2000)
      .then(() => tweener.destroy())
      .then(() => this.blink());
  }
}