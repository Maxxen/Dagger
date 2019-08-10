import { Rectangle } from "./Rectangle";
import { Color } from "./Color";
import { Vector2 } from "./Vector2";
import { SpriteMaterial } from "./SpriteMaterial";

export class Sprite {
  dimensions: Rectangle;
  crop: Rectangle;
  color: Color;
  origin: Vector2;
  depth: number;
  material: SpriteMaterial;

  constructor(
    material: SpriteMaterial,
    dimensions: Rectangle,
    crop: Rectangle,
    color: Color,
    origin: Vector2,
    depth: number
  ) {
    this.material = material;
    this.dimensions = dimensions;
    this.crop = crop;
    this.color = color;
    this.origin = origin;
    this.depth = depth;
  }
}
