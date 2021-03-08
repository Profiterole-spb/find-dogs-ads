import {Container, Sprite, AnimatedSprite} from 'pixi.js/dist/browser/pixi.min.mjs';
import {preloadPack} from '../preloadPack/preloadPack';
import Core from '../../core/Core';
import Viewport from 'src/js/Viewport/Viewport';

export default class MainScene extends Container {
  static get() {
    if (!this._scene) {
      this._scene = new MainScene();
    }
    return this._scene;
  }

  get dogsPositions() {
    const landscape = [
      {x: 886, y: 340, rotation: 0},
      {x: 484, y: 236, rotation: 12},
      {x: 858, y: 160, rotation: 0},
      {x: 120, y: 172, rotation: 12},
      {x: 226, y: 516, rotation: 0},
    ];

    const portrait = [
      {x: 658, y: 288, rotation: 0},
      {x: 484, y: 236, rotation: 12},
      {x: 460, y: 410, rotation: 0},
      {x: 348, y: 36, rotation: 12},
      {x: 674, y: 502, rotation: 0},
    ];

    return Viewport.isPortrait() ? portrait : landscape;
  }

  constructor() {
    super();
    this._background = new Sprite(Core.getTexture(preloadPack.background));
    this.addChild(this._background);
    this._dogs = [];
    this.circleTextures = preloadPack.circle.map((src) => {
      return Core.getTexture(src);
    });
    for (let i = 0; i < 5; i++) {
      const texture = Core.getTexture(preloadPack.dog);
      texture.rotate = this.dogsPositions[i].rotation;
      const dog = new Sprite(texture);
      dog.interactive = true;
      dog.buttonMode = true;
      this._dogs.push(dog);
      this.addChild(dog);
    }
    Core.get().renderer.on('resize', this.resize, this);
    Core.get().resize();
  }

  resize() {
    this._dogs.forEach((dog, i) => {
      dog.x = this.dogsPositions[i].x;
      dog.y = this.dogsPositions[i].y;
    });
    if (this._circles && this._clickCount) {
      this._circles.forEach((c, i) => {
        const index = this._clickCount[i];
        c.x = this._dogs[index].width / 2 + this.dogsPositions[index].x;
        c.y = this._dogs[index].height / 2 + this.dogsPositions[index].y;
      });
    }
  }

  destroy() {
    Core.get().renderer.off('resize', this.resize);
    this.removeChild(this._background);
    this._background.destroy();
    super.destroy();
  }

  awaitGameOver() {
    return new Promise((resolve) => {
      this._circles = [];
      this._clickCount = [];

      const onDogClickHandler = (e) => {
        console.log('CLICK ON DOG', e);
        e.target.interactive = false;
        this._clickCount.push(this._dogs.indexOf(e.target));
        console.log('clickCount', this._clickCount);
        const circle = new AnimatedSprite(this.circleTextures);
        this._circles.push(circle);
        circle.x = e.target.width / 2 + e.target.x;
        circle.y = e.target.height / 2 + e.target.y;
        circle.anchor.set(0.5);
        circle.loop = false;
        circle.animationSpeed = 0.5;
        this.addChild(circle);
        circle.play();
        if (this._clickCount.length === 5) {
          resolve();
        }
      };

      this._dogs.forEach((dog) => {
        dog.on('pointerup', onDogClickHandler, this);
      });
    });
  }
}
