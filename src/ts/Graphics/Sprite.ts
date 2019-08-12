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

  public pack(buffer: ArrayBuffer, offset: number) {
    const bytes = new Uint8Array(buffer, offset);
    const floats = new Float32Array(buffer, offset);

    const { dimensions, crop, color, origin, depth } = this;

    // We unroll the packing to optimize
    // It is faster than .set() for small data sets

    // Bytes 0 to 12
    floats[0] = dimensions.x - origin.x;
    floats[1] = dimensions.y - origin.y;
    floats[2] = depth;

    // bytes 12 to 16
    bytes[12] = color.r;
    bytes[13] = color.g;
    bytes[14] = color.b;
    bytes[15] = color.a;

    // bytes 16 to 24
    floats[4] = crop.x;
    floats[5] = crop.y - crop.height;

    // bytes 24 to 36
    floats[6] = dimensions.x - origin.x;
    floats[7] = dimensions.y - dimensions.height - origin.y;
    floats[8] = depth;

    // bytes 36 to 40
    floats.copyWithin(9, 3, 4);

    // bytes 40 to 48
    floats[10] = crop.x;
    floats[11] = crop.y;

    // bytes 48 to 60
    floats[12] = dimensions.x + dimensions.width - origin.x;
    floats[13] = dimensions.y - origin.y;
    floats[14] = depth;

    // bytes 60 to 64
    floats.copyWithin(15, 3, 4);

    // bytes 64 to 72
    floats[16] = crop.x + crop.width;
    floats[17] = crop.y - crop.height;

    // bytes 72 to 84
    floats[18] = dimensions.x + dimensions.width - origin.x;
    floats[19] = dimensions.y - dimensions.height - origin.y;
    floats[20] = depth;

    //bytes 84 to 88
    floats.copyWithin(21, 3, 4);

    //bytes 88 to 96
    floats[22] = crop.x + crop.width;
    floats[23] = crop.y;
  }
}
