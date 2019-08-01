import { InputEventType } from "./InputManager";
import { Scene } from "./Scene";
import { ContentLoader } from "./ContentLoader";
import { Game } from "./Game";
import { SpriteComponent, SpriteMaterial } from "./Graphics/SpriteComponent";
import { Renderable } from "./Graphics/Renderable";
import { GameObject } from "./GameObject";
import { Texture2D } from "./Graphics/Texture2D";
import { Batcher } from "./Graphics/Batcher";

import { QUAD } from "./Graphics/Quad";
import { Color } from "./Graphics/Color";
import { Vector2 } from "./Graphics/Vector2";

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
    loader.add("tex1", "assets/test2.png").load();
  }

  init() {}
  batcher = new Batcher();
  update() {}

  shader = new SpriteMaterial();
  quad = QUAD;

  draw() {
    Game.instance.once = false;
    this.batcher.begin(this.camera.viewProj);

    this.batcher.draw(
      Game.instance.content.get("tex1")!,
      new Vector2(-1, 0),
      Color.WHITE
    );

    this.batcher.draw(
      Game.instance.content.get("tex1")!,
      new Vector2(0, 0),
      Color.WHITE
    );

    this.batcher.end();

    /*
    this.shader.MVP = this.camera.viewProj;
    this.shader.texture = Game.instance.content.get("tex1")!;
    this.shader.shader.use();
    this.shader.use();
    this.quad.bind();
    gl.drawElements(gl.TRIANGLES, this.quad.indexCount, gl.UNSIGNED_SHORT, 0);
    this.quad.unbind();
    */
  }

  unload() {}
}

export class Player extends GameObject implements Renderable {
  renderer: SpriteComponent;

  constructor(tex?: Texture2D) {
    super();

    this.renderer = new SpriteComponent(tex);
  }
}
