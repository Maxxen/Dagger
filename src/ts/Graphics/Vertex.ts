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
    this.uv.pack(new Float32Array(buffer), offset / 4 + 4);
  }
}

export class VertexPositionUV implements Vertex {
  static layout = new VertexLayout(
    [AttribType.FLOAT, 3],
    [AttribType.FLOAT, 2]
  );

  constructor(public position: Vector3, public uv: Vector2) {}

  getLayout() {
    return VertexPositionUV.layout;
  }

  pack(buffer: ArrayBuffer, offset: number): void {
    this.position.pack(new Float32Array(buffer), offset / 4);
    this.uv.pack(new Float32Array(buffer), offset / 4 + 3);
  }
}

export class QuadPositionColorUV implements Vertex {
  static layout = new VertexLayout(
    [AttribType.FLOAT, 3],
    [AttribType.UNSIGNED_BYTE, 4],
    [AttribType.FLOAT, 2],
    [AttribType.FLOAT, 3],
    [AttribType.UNSIGNED_BYTE, 4],
    [AttribType.FLOAT, 2],
    [AttribType.FLOAT, 3],
    [AttribType.UNSIGNED_BYTE, 4],
    [AttribType.FLOAT, 2],
    [AttribType.FLOAT, 3],
    [AttribType.UNSIGNED_BYTE, 4],
    [AttribType.FLOAT, 2]
  );

  constructor(
    public pos0: Vector3,
    public col0: Color,
    public uv0: Vector2,
    public pos1: Vector3,
    public col1: Color,
    public uv1: Vector2,
    public pos2: Vector3,
    public col2: Color,
    public uv2: Vector2,
    public pos3: Vector3,
    public col3: Color,
    public uv3: Vector2
  ) {}

  getLayout() {
    return QuadPositionColorUV.layout;
  }

  pack(buffer: ArrayBuffer, offset: number): void {
    const floats = new Float32Array(buffer, offset / 4);
    const ubytes = new Uint8Array(buffer, offset);

    // We inline packing to optimize.

    // Bytes 0 to 12
    floats[0] = this.pos0.x;
    floats[1] = this.pos0.y;
    floats[2] = this.pos0.z;

    // bytes 12 to 16
    this.col0.pack(ubytes, 12);
    //ubytes[12] =  this.col0.r;
    //ubytes[13] = this.col0.g;
    //ubytes[14] = this.col0.b;
    //ubytes[15] = this.col0.a;

    // bytes 16 to 24
    floats[4] = this.uv0.x;
    floats[5] = this.uv0.y;

    // bytes 24 to 36
    floats[6] = this.pos1.x;
    floats[7] = this.pos1.y;
    floats[8] = this.pos1.z;

    // bytes 36 to 40
    this.col1.pack(ubytes, 36);
    //ubytes[36] = this.col1.r;
    //ubytes[37] = this.col1.g;
    //ubytes[38] = this.col1.b;
    //ubytes[39] = this.col1.a;

    // bytes 40 to 48
    floats[10] = this.uv1.x;
    floats[11] = this.uv1.y;

    // bytes 48 to 60
    floats[12] = this.pos2.x;
    floats[13] = this.pos2.y;
    floats[14] = this.pos2.z;

    // bytes 60 to 64
    this.col2.pack(ubytes, 60);
    //ubytes[60] = this.col2.r;
    //ubytes[61] = this.col2.g;
    //ubytes[62] = this.col2.b;
    //ubytes[63] = this.col2.a;

    // bytes 64 to 72
    floats[16] = this.uv2.x;
    floats[17] = this.uv2.y;

    // bytes 72 to 84
    floats[18] = this.pos3.x;
    floats[19] = this.pos3.y;
    floats[20] = this.pos3.z;

    //bytes 84 to 88
    this.col3.pack(ubytes, 84);
    //ubytes[84] = this.col3.r;
    //ubytes[85] = this.col3.g;
    //ubytes[86] = this.col3.b;
    //ubytes[87] = this.col3.a;

    //bytes 88 to 96
    floats[22] = this.uv3.x;
    floats[23] = this.uv3.y;
  }
}
