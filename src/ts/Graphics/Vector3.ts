export class Vector3 {
  constructor(public x: number, public y: number, public z: number) {}
  pack(view: Float32Array, offset: number): void {
    view[offset] = this.x;
    view[offset + 1] = this.y;
    view[offset + 2] = this.z;
  }
}
