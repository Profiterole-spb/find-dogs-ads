import {Container, Sprite, Texture, Text} from 'pixi.js/dist/browser/pixi.mjs';
import Core from 'src/js/core/Core';
import {preloadPack} from 'src/js/display/preloadPack/preloadPack';
import Tweener from 'src/js/utils/Tweener';
import Viewport from 'src/js/Viewport/Viewport';

export default class Outro extends Container {
  static get() {
    if (!this._scene) {
      this._scene = new Outro();
    }
    return this._scene;
  }

  constructor() {
    super();
    this.alpha = 0;
    this._background = new Sprite(Texture.WHITE);
    this._background.alpha = 0.8;
    this._background.tint = 0;

    this._char = new Sprite(Core.getTexture(preloadPack.char));
    this._logo = new Sprite(Core.getTexture(preloadPack.logo));
    this._logo.anchor.set(0.5, 0);

    this._greateJobText = new Text(
        'Great Job',
        {
          fontFamily: 'Arial',
          fontSize: 100,
          fontWeight: 'bold',
          fill: ['#e0b84f', '#9b882a'], // gradient
          stroke: '#473a15',
          strokeThickness: 5,
          dropShadow: true,
          dropShadowColor: '#000000',
          dropShadowBlur: 6,
        },
    );
    this._greateJobText.anchor.set(0.5, 0);

    this._canYouSolveText = new Text(
        'Can you solve every mystery?',
        {
          fontSize: 48,
          fill: 0xffffff,
          fontWeight: 'bold',
          align: 'center',
          wordWrap: true,
          wordWrapWidth: 440,
          lineJoin: 'round',
        },
    );
    this._canYouSolveText.anchor.set(0.5, 0);

    this.addChild(
        this._background, this._char,
        this._logo, this._greateJobText,
        this._canYouSolveText,
    );

    Core.get().renderer.on('resize', this.resize, this);
    Core.get().resize();
  }

  resize() {
    const isPort = Viewport.isPortrait();
    this._background.width = Viewport.boundWidth;
    this._background.height = Viewport.boundHeight;
    this._logo.scale.set(isPort ? 0.8 : 1);
    this._logo.x = Viewport.boundWidth / 2;
    this._char.scale.set(isPort ? 0.5 : 1);
    this._char.texture.rotate = isPort ? 12 : 0;
    this._char.x = isPort ?
      Viewport.boundWidth / 2 - this._char.width / 2 :
      -120;
    this._char.y = isPort ?
      Viewport.boundHeight - this._char.height - 110 :
      0;

    this._greateJobText.style.fontSize = isPort ? 80 : 110;
    this._greateJobText.x = Viewport.boundWidth / 2;
    this._greateJobText.y = isPort ?
      this._logo.y + this._logo.height + 150 :
      this._logo.y + this._logo.height + 10;
    this._canYouSolveText.x = Viewport.boundWidth / 2;
    this._canYouSolveText.y = isPort ?
      this._greateJobText.y + this._greateJobText.height :
      this._greateJobText.y + this._greateJobText.height + 20;
  }

  fadeIn() {
    const target = {alpha: 0};
    this.firstTween = new Tweener(target);
    this.firstTween.onTick = () => {
      this.alpha = target.alpha;
    };
    return this.firstTween.asyncTo({alpha: 1}, 1200);
  }
}
