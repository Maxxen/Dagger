import { Renderable } from "../Rendering/Renderable";
import { SpriteMaterial } from "./SpriteMaterial";
import { Camera } from "./Camera";
import { Graphics } from "../Rendering/Graphics";
import { Sprite } from "./Sprite";
import { Rectangle } from "./Rectangle";
import { Vector2 } from "./Vector2";
import { Color } from "./Color";

export class SpriteComponent implements Renderable {
  material: SpriteMaterial;
  isHidden: boolean;
  depth: number;
  sprite: Sprite;

  constructor(
    material: SpriteMaterial,
    dimensions: Rectangle,
    color: Color = Color.WHITE,
    origin: Vector2 = new Vector2(0, 0),
    crop: Rectangle = new Rectangle(0, 0, 1, 1),
    depth: number = 0
  ) {
    this.material = material;
    this.isHidden = false;
    this.depth = depth;

    this.sprite = new Sprite(
      this.material,
      dimensions,
      crop,
      color,
      origin,
      depth
    );
  }

  isVisible(camera: Camera): boolean {
    //TODO: proper camera bounds checking
    if (camera) {
      return true;
    } else return true;
  }

  render(graphics: Graphics, camera: Camera): void {
    this.material.MVP = camera.viewProj;
    graphics.spriteBatch.batch(this.sprite);
  }
}
