export class Vector2 {
  constructor(public x: number, public y: number) {}

  public copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public add(p: Vector2): Vector2 {
    return new Vector2(this.x + p.x, this.y + p.y);
  }

  public sub(p: Vector2): Vector2 {
    return new Vector2(this.x - p.x, this.y - p.y);
  }

  public distanceSquared(p: Vector2): number {
    return ((p.x - this.x) ^ 2) + ((p.y - this.y) ^ 2);
  }

  public distance(p: Vector2) {
    return Math.sqrt(((p.x - this.x) ^ 2) + ((p.y - this.y) ^ 2));
  }

  pack(view: Float32Array, offset: number = 0): void {
    view[offset] = this.x;
    view[offset + 1] = this.y;
  }
}
