import { Vector2 } from "./Vector2";

export class Rectangle {
  public x: number = 0;
  public y: number = 0;

  public width: number = 0;
  public height: number = 0;

  get topLeft(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  get topRight(): Vector2 {
    return new Vector2(this.x + this.width, this.y);
  }

  get botLeft(): Vector2 {
    return new Vector2(this.x, this.y + this.height);
  }

  get botRight(): Vector2 {
    return new Vector2(this.x + this.width, this.y + this.width);
  }

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
