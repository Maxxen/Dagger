import { InputEventType } from "./InputManager";
import { Scene } from "./Scene";
import { ContentLoader } from "./ContentLoader";
import { Game } from "./Game";
import { Batcher } from "./Graphics/Batcher";
import { Texture2D } from "./Graphics/Texture2D";
import { Rectangle } from "./Graphics/Rectangle";

export class MyScene extends Scene {
  batcher: Batcher;

  constructor() {
    super("MyScene");

    this.camera.position = [0, 0, 0];
    this.batcher = new Batcher();

    Game.instance.input.subscribe(ev => {
      if (ev.type == InputEventType.KEY_DOWN) {
        switch (ev.key) {
          case "left":
            this.camera.move([-0.1, 0, 0]);
            break;
          case "right":
            this.camera.move([0.1, 0, 0]);
            break;
          case "up":
            this.camera.move([0, 0.1, 0]);
            break;
          case "down":
            this.camera.move([0, -0.1, 0]);
        }
      }
    });
  }

  load(loader: ContentLoader) {
    loader
      .add("tex1", "assets/test2.png")
      .add("tex2", "assets/test.png")
      .load();
  }

  tex1: Texture2D | null = null;
  tex2: Texture2D | null = null;
  init() {
    this.tex1 = Game.instance.content.get("tex1")!;
    this.tex2 = Game.instance.content.get("tex2")!;
  }
  update() {}

  draw() {
    Game.instance.once = false;
    this.batcher.begin(this.camera.viewProj);

    for (let i = 0; i < 100; i++) {
      this.batcher.draw(this.tex1!, new Rectangle(i, 0, 1, 1));
      this.batcher.draw(this.tex2!, new Rectangle(i, 1, 0.5, 0.5));
    }
    for (let i = 0; i < 100; i++) {}
    this.batcher.end();
  }

  unload() {}
}
