
import './styles/main.css';
import { preloadPack } from './js/display/preloadPack/preloadPack';
import Core from "./js/core/Core";
import MainScene from "./js/display/MainScene/MainScene";
import Intro from "./js/display/Intro/Intro";
import Outro from "./js/display/Outro/Outro";
import {Button} from "./js/display/button/Button";
import Viewport from "src/js/Viewport/Viewport";

const core = Core.get();

console.log('core is created', core);
document.body.appendChild(core.view);

Core.load(Object.values(preloadPack).flat())
  .then(createViewport)
  .then(showScene)
  .then(showButton)
  .then(showIntro)
  .then(timeOutOneSecond)
  .then(hideIntro)
  .then(activity)
  .then(showOutro)
  .then(blinkButton)

function createViewport() {
  core.stage.addChild(Viewport.get())
}

function showScene() {
  const scene = MainScene.get()
  Viewport.get().addChild(scene)
  scene.interactiveChildren = false;
}

function showButton() {
  const btn = Button.get();
  Viewport.get().addChild(btn);
}

function showIntro() {
  const intro = Intro.get();
  Viewport.get().addChildAt(intro, 1);
  return intro.fadeIn();
}

function hideIntro() {
  const intro = Intro.get();
  return intro.fadeOut()
    .then(() => {
      Viewport.get().removeChild(intro);
      intro.destroy();
    })
}

function timeOutOneSecond() {
  return new Promise((resolve) => setTimeout(() => resolve(), 1000))
}

function activity() {
  const scene = MainScene.get();
  scene.interactiveChildren = true;
  return scene.awaitGameOver()
    .then(() => {
      scene.interactiveChildren = false;
  })
}

function showOutro() {
  const intro = Outro.get();
  Viewport.get().addChildAt(intro, 1);
  return intro.fadeIn();
}

function blinkButton() {
  Button.get().blink()
}