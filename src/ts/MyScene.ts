import { InputEventType } from "./InputManager";
import { Scene } from "./Scene";
import { ContentLoader } from "./ContentLoader";
import { Game } from "./Game";
import { Sprite } from "./Graphics/Sprite";

export class MyScene extends Scene {
  constructor() {
    super("MyScene");

    this.camera.position = [0, 0, 0];

    Game.instance.input.subscribe(ev => {
      if (ev.type == InputEventType.KEY_DOWN) {
        switch (ev.key) {
          case "left":
            this.camera.move([-0.1, 0, 0]);
            break;
          case "right":
            this.camera.move([0.1, 0, 0]);
            break;
        }
      }
    });
  }

  load(loader: ContentLoader) {
    loader.add("tex1", "assets/test2.png").load();
  }

  init() {
    const tex = Game.instance.content.get("tex1")!;

    this.gameObjects.push(new Sprite(tex));
  }
  update() {}

  unload() {}
}
