import { InputEventType } from "./InputManager";
import { Scene } from "./Scene";
import { ContentLoader } from "./ContentLoader";
import { Game } from "./Game";
import { Texture2D } from "./Graphics/Texture2D";
import { Rectangle } from "./Graphics/Rectangle";
import { SpriteComponent } from "./Graphics/SpriteComponent";
import { Renderable } from "./Rendering/Renderable";
import { SpriteMaterial } from "./Graphics/SpriteMaterial";

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

    const mat1 = new SpriteMaterial();
    mat1.texture = this.tex1;

    const mat2 = new SpriteMaterial();
    mat2.texture = this.tex2;

    let renderables: Renderable[] = [];

    for (let i = 0; i < 100; i++) {
      renderables.push(new SpriteComponent(mat1, new Rectangle(i, 0, 1, 1)));
      renderables.push(
        new SpriteComponent(mat2, new Rectangle(i, 1, 0.5, 0.5))
      );
    }

    this.renderList.push(...renderables);
  }
  update() {}

  unload() {}
}
