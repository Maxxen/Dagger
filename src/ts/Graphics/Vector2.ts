export class Vector2 {
  constructor(public x: number, public y: number) {}
  pack(view: Float32Array, offset: number): void {
    view[offset] = this.x;
    view[offset + 1] = this.y;
  }
}
