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
    this.vertices[this.idx] = vertex;
    this.indices[this.idx] = this.idx;
    this.idx++;

    return this;
  }

  finalize(): Geometry {
    const layout = this.vertices[0].getLayout();
    const buffer = new ArrayBuffer(this.vertices.length * layout.stride);

    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].pack(buffer, i * layout.stride);
    }

    return new Geometry(
      new VertexBuffer(layout, buffer),
      new IndexBuffer(new Uint16Array(this.indices))
    );
  }
}
