import {Ticker} from 'pixi.js/dist/browser/pixi.mjs';


export default class Tweener {
  constructor(target) {
    this._ticker = new Ticker;
    this._target = target;
  }

  asyncTo(data, duration) {
    if (duration === 0) return Promise.resolve();
    this._timeline = 0;
    return new Promise((resolve) => {
      const velocity = {};
      const initState = {};
      Object.keys(data).forEach((key) => {
        velocity[key] = (data[key] - this._target[key]) / duration;
        initState[key] = this._target[key];
      });
      const callback = (delta) => {
        this._timeline += delta * this._ticker.elapsedMS;
        if (this._timeline >= duration) {
          Object.keys(data).forEach((key) => {
            this._target[key] = data[key];
          });
          this.onTick();
          this._ticker.stop();
          this._ticker.remove(callback, this);
          resolve();
          return;
        }
        Object.keys(data).forEach((key) => {
          this._target[key] = velocity[key] * this._timeline + initState[key];
          this.onTick();
        });
      };
      this._ticker.add(callback, this);
      this._ticker.start();
    });
  }

  onTick() {}

  destroy() {
    this._ticker.stop();
    this._ticker.destroy();
    Object.keys(this).forEach((p) => {
      p = null;
    });
  }
}
