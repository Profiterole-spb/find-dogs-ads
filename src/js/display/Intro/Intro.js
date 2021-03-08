import {Container, Sprite, Texture, Text} from 'pixi.js/dist/browser/pixi.mjs';
import {preloadPack} from 'src/js/display/preloadPack/preloadPack';
import Core from 'src/js/core/Core';
import Tweener from 'src/js/utils/Tweener';
import Viewport from 'src/js/Viewport/Viewport';

export default class Intro extends Container {
  static get() {
    if (!this._scene) {
      this._scene = new Intro();
    }
    return this._scene;
  }

  constructor() {
    super();
    this._background = new Sprite(Texture.WHITE);
    this._background.alpha = 0;
    this._background.tint = 0;

    this._textWrapper = new Container();
    this._textWrapper.scale.set(0.5);
    this._textWrapper.alpha = 1;

    this._text = new Text(
        '5 hidden dogs',
        {fontFamily: 'Arial', fontSize: 36, fill: 0xffffff, align: 'center', fontWeight: 'bold'},
    );
    this._textSecond = new Text(
        'Can you spot them?',
        {fontFamily: 'Arial', fontSize: 36, fill: 0xffffff, align: 'center', fontWeight: 'bold'},
    );
    this._dog = new Sprite(Core.getTexture(preloadPack.dog));
    this._dog.texture.rotate = 12;
    this._dog.scale.set(0.5);

    this._textWrapper.addChild(this._text, this._textSecond, this._dog);
    this.addChild(this._background, this._textWrapper);

    Core.get().renderer.on('resize', this.resize, this);
    Core.get().resize();
  }

  resize() {
    this._background.width = Viewport.boundWidth;
    this._background.height = Viewport.boundHeight;
    this._text.style.fontSize = 40;
    this._textSecond.style.fontSize = 40;
    this._dog.scale.set(0.7);
    this._text.x = -(this._text.width + this._dog.width) / 2;
    this._dog.x = this._text.x + this._text.width;
    this._textSecond.x = -this._textSecond.width / 2;
    this._dog.y = -(this._dog.height + this._textSecond.height) / 2;
    this._text.y = this._dog.y + this._dog.height / 2 - this._text.height / 2;
    this._textSecond.y = this._dog.y + this._dog.height;
    this._textWrapper.x = Viewport.boundWidth / 2;
    this._textWrapper.y = Viewport.boundHeight / 2;
  }

  fadeIn() {
    const target = {alpha: 0, scale: 0.5};
    this.firstTween = new Tweener(target);
    this.firstTween.onTick = () => {
      this._background.alpha = target.alpha;
      this._textWrapper.alpha = target.alpha;
      this._textWrapper.scale.set(target.scale);
    };
    this.secondTween = new Tweener(target);
    this.secondTween.onTick = () => {
      this._textWrapper.alpha = target.alpha;
      this._textWrapper.scale.set(target.scale);
    };
    return this.firstTween.asyncTo({alpha: 0.8, scale: 0.8}, 1500)
        .then(() => this.secondTween.asyncTo({alpha: 1, scale: 1}, 1000));
  }

  fadeOut() {
    const target = {alpha: 1};
    this.tween = new Tweener(target);
    this.tween.onTick = () => {
      this.alpha = target.alpha;
    };
    return this.tween.asyncTo({alpha: 0}, 1500);
  }
}
