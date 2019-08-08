import { Vector2 } from "./Graphics/Vector2";

export class GameObject {
  children: GameObject[] = [];
  constructor() {}

  position: Vector2 = new Vector2(0, 0);
  update() {}
}
