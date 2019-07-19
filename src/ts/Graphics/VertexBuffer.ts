import { gl } from "../Game";
import { VertexLayout } from "./VertexLayout";

export class VertexBuffer {
  private id: WebGLBuffer;
  private _count: number = 0;

  public readonly layout: VertexLayout;

  constructor(layout: VertexLayout, vertices?: Float32Array) {
    this.id = gl.createBuffer()!;

    this.layout = layout;
    if (vertices) {
      this.setData(vertices);
    }
  }

  public setData(vertices: Float32Array) {
    this._count = vertices.length / this.layout.elements.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  public bind() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
  }

  public unbind() {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  public dispose() {
    gl.deleteBuffer(this.id);
  }

  public get count() {
    return this._count;
  }
}
