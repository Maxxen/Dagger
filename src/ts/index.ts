import { initGL } from "./Graphics/gl";
initGL(); // We have to initialize webgl before we import further
import { MyScene } from "./MyScene";
import { Game } from "./Game";
import { DefaultScene } from "./Scene";

console.log("Hello world!");

const scene = new MyScene();
const game = new Game(new DefaultScene());
game.sceneManager.addScene(scene);
game.sceneManager.switchScene("MyScene");
game.start();
