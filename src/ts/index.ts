import { initGL } from "./Graphics/gl";
initGL(); // We have to initialize webgl before we import further
import { MyScene } from "./MyScene";
import { Game } from "./Game";

console.log("Hello world!");

const scene = new MyScene();
const game = Game.instance;
game.scenes.addScene(scene);
game.scenes.switchScene("MyScene");
game.start();
