import { Renderable } from "../Rendering/Renderable";
import { SpriteMaterial } from "./SpriteMaterial";
import { Camera } from "./Camera";
import { Rectangle } from "./Rectangle";
import { Color } from "./Color";
import { Vector2 } from "./Vector2";
import { RenderQueue, Transparency } from "../Rendering/Renderer";

export class SpriteComponent implements Renderable {
  material: SpriteMaterial;
  isHidden: boolean;

  dimensions: Rectangle;
  color: Color;
  crop: Rectangle;
  origin: Vector2;
  depth: number;

  constructor(
    material: SpriteMaterial,
    dimension: Rectangle,
    color: Color = Color.WHITE,
    origin: Vector2 = new Vector2(0, 0),
    crop: Rectangle = new Rectangle(0, 0, 1, 1),
    depth: number = 0
  ) {
    this.material = material;
    this.isHidden = false;
    this.depth = depth;
    this.dimensions = dimension;
    this.color = color;
    this.origin = origin;
    this.crop = crop;
  }

  isVisible(camera: Camera): boolean {
    //TODO: proper camera bounds checking
    if (camera) {
      return true;
    } else return true;
  }

  render(queue: RenderQueue, camera: Camera): void {
    this.material.MVP = camera.viewProj;

    queue.submit(Transparency.OPAQUE, {
      type: "Sprite",
      material: this.material,
      dimensions: this.dimensions,
      color: this.color,
      origin: this.origin,
      crop: this.crop,
      depth: this.depth
    });
  }
}
