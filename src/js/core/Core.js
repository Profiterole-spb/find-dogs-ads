import * as PIXI from 'pixi.js/dist/browser/pixi.min.mjs';

export default class Core {
  static get config() {
    return {
      autoDensity: true,
      resolution: window.devicePixelRatio,
      resizeTo: document.body,
      antialias: true,
    };
  }

  static get() {
    if (!this._core) {
      this._core = new PIXI.Application(this.config);
    }
    return this._core;
  }

  static load(src) {
    console.log('load resources', src);
    return new Promise((resolve) => {
      this._core.loader.onError = () => {
        throw new Error('loading error');
      };
      this._core.loader.add(src);
      this._core.loader.load(() => resolve());
    });
  }

  static getTexture(src) {
    return new PIXI.Texture(this._core.loader.resources[src].texture.baseTexture);
  }
}
