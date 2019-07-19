import { Geometry } from "./Geometry";
import { VertexBuffer } from "./VertexBuffer";
import { VertexLayout, AttribType } from "./VertexLayout";
import { IndexBuffer } from "./IndexBuffer";

export class GeometryBuilder {
  private indices: number[] = [];
  private vertexData: number[] = [];
  private idx: number = 0;

  constructor() {
    this.vertexData;
  }

  public add(
    [x, y, z]: [number, number, number],
    [r, g, b, a]: [number, number, number, number]
  ) {
    this.vertexData[this.idx * 7 + 0] = x;
    this.vertexData[this.idx * 7 + 1] = y;
    this.vertexData[this.idx * 7 + 2] = z;
    this.vertexData[this.idx * 7 + 3] = r;
    this.vertexData[this.idx * 7 + 4] = g;
    this.vertexData[this.idx * 7 + 5] = b;
    this.vertexData[this.idx * 7 + 6] = a;

    this.indices[this.idx] = this.idx;
    this.idx++;

    return this;
  }

  finalize(): Geometry {
    return new Geometry(
      new VertexBuffer(
        new VertexLayout(
          { type: AttribType.FLOAT, count: 3 },
          { type: AttribType.FLOAT, count: 4 }
        ),
        new Float32Array(this.vertexData)
      ),
      new IndexBuffer(new Uint16Array(this.indices))
    );
  }
}
/*
class A<T extends number[][]> {
  constructor(...a: T) {
    console.log(a);
  }
}

type vert = [[number, number, number], [number, number, number, number]];

const a = new A<vert>([1, 2, 3], [1, 2, 3, 4]);
*/
