/*
import { Texture2D } from "./Texture2D";
import { Rectangle } from "../Rectangle";
import { Point } from "../Point";
import { Geometry } from "./Geometry";

export class SpriteBatch {
  drawing: boolean = false;
  geometry: Geometry = new Geometry();

  constructor() {}

  begin() {
    this.drawing = true;
  }

  end() {
    this.drawing = false;
  }

  draw(
    texture: Texture2D,
    destination: Rectangle,
    bounds?: Rectangle,
    color?: number,
    flipx?: boolean
  ) {
    bounds ? bounds : new Rectangle(new Point(0, 0), new Point(1, 1));
    color ? color : [1, 1, 1, 1];
    flipx ? flipx : false;

    
  }
}
*/
