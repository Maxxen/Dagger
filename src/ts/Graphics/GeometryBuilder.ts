import { Geometry } from "./Geometry";
import { VertexBuffer } from "./VertexBuffer";
import { IndexBuffer } from "./IndexBuffer";
import { Vertex } from "./Vertex";

export class GeometryBuilder<V extends Vertex> {
  private indices: number[] = [];
  private vertices: V[] = [];
  private idx: number = 0;

  constructor() {}

  public add(vertex: V) {
    this.vertices.push(vertex);
    this.indices[this.idx] = this.idx;
    this.idx++;

    return this;
  }

  public addQuad(tl: V, tr: V, bl: V, br: V) {
    this.vertices.push(tl);
    this.vertices.push(bl);
    this.vertices.push(br);
    this.vertices.push(tr);

    this.indices[this.idx] = this.idx;
    this.indices[this.idx + 1] = this.idx + 1;
    this.indices[this.idx + 2] = this.idx + 2;
    this.indices[this.idx + 3] = this.idx + 2;
    this.indices[this.idx + 4] = this.idx + 3;
    this.indices[this.idx + 5] = this.idx;

    this.idx += 6;

    return this;
  }

  finalize(): Geometry {
    const layout = this.vertices[0].getLayout();
    const buffer = new ArrayBuffer(this.vertices.length * layout.stride);

    console.log(layout.stride);
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].pack(buffer, i * layout.stride);
    }

    return new Geometry(
      new VertexBuffer(layout, buffer),
      new IndexBuffer(new Uint16Array(this.indices))
    );
  }
}
