import { Vector2 } from "./Graphics/Vector2";
import { Renderer } from "./Renderer";

export class GameObject {
  children: GameObject[] = [];
  constructor() {}

  position: Vector2 = new Vector2(0, 0);
  update() {}

  draw(renderer: Renderer) {
    renderer.register(this);
    this.children.forEach(child => child.draw(renderer));
  }
}
