import { VertexLayout, AttribType } from "./VertexLayout";
import { Vector3 } from "./Vector3";
import { Color } from "./Color";
import { Vector2 } from "./Vector2";

export interface Vertex {
  getLayout(): VertexLayout;
  pack(array: ArrayBuffer, offset: number): void;
}

export class VertexPositionColor implements Vertex {
  static layout = new VertexLayout(
    [AttribType.FLOAT, 3],
    [AttribType.UNSIGNED_BYTE, 4]
  );

  constructor(public position: Vector3, public color: Color) {}

  getLayout() {
    return VertexPositionColor.layout;
  }

  pack(buffer: ArrayBuffer, offset: number): void {
    this.position.pack(new Float32Array(buffer), offset / 4);
    this.color.pack(new Uint8Array(buffer), offset + 12);
  }
}

export class VertexPositionColorUV implements Vertex {
  static layout = new VertexLayout(
    [AttribType.FLOAT, 3],
    [AttribType.UNSIGNED_BYTE, 4],
    [AttribType.FLOAT, 2]
  );

  constructor(
    public position: Vector3,
    public color: Color,
    public uv: Vector2
  ) {}

  getLayout() {
    return VertexPositionColorUV.layout;
  }

  pack(buffer: ArrayBuffer, offset: number): void {
    this.position.pack(new Float32Array(buffer), offset / 4);
    this.color.pack(new Uint8Array(buffer), offset + 12);
    this.uv.pack(new Float32Array(buffer), offset / 4 + 5);
  }
}
