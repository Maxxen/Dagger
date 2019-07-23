/* import { Texture2D } from "./Texture2D";
import { Rectangle } from "../Rectangle";
import { Point } from "../Point";
import { Geometry } from "./Geometry";
import { mat4 } from "gl-matrix";
import { Color } from "./Color";

class SpriteBatchItem {
  constructor(
    public texture: Texture2D,
    public destination: Rectangle,
    public bounds: Rectangle,
    public color: Color,
    public flipx: boolean
  ) {}
}

export class SpriteBatch {
  drawing: boolean = false;
  idx: number[];
  matrix: mat4 = mat4.create();
  items: SpriteBatchItem[] = [];

  readonly maxSprites = 256;
  constructor() {
    this.idx = new Array<number>(this.maxSprites);

    for (let i = 0; i < this.maxSprites; i++) {
      this.idx[i * 6 + 0] = i * 4;
      this.idx[i * 6 + 1] = i * 4 + 1;
      this.idx[i * 6 + 2] = i * 4 + 2;
      this.idx[i * 6 + 3] = i * 4 + 1;
      this.idx[i * 6 + 4] = i * 4 + 3;
      this.idx[i * 6 + 5] = i * 4 + 2;
    }
  }

  begin() {
    this.drawing = true;
  }

  end() {
    this.drawing = false;
  }

  draw(
    texture: Texture2D,
    destination: Rectangle,
    bounds: Rectangle = new Rectangle(new Point(0, 0), new Point(1, 1)),
    color: Color = Color.White,
    flipx: boolean = false
  ) {
    this.items.push(new SpriteBatchItem(texture, destination, bounds, color, flipx);)
    }

  private createQuad(texture: Texture2D) {}
}
*/
