import { gl } from "./gl";
import { VertexLayout } from "./VertexLayout";

export class VertexBuffer {
  private id: WebGLBuffer;
  private _count: number = 0;

  public readonly layout: VertexLayout;

  constructor(layout: VertexLayout, vertices?: ArrayBuffer) {
    this.id = gl.createBuffer()!;

    this.layout = layout;
    if (vertices) {
      this.setData(vertices);
    }
  }

  public setData(vertices: ArrayBuffer) {
    this._count = vertices.byteLength / this.layout.stride;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  public bind() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
  }

  public applyAttribs() {
    let offset = 0;
    for (var i = 0; i < this.layout.elements.length; i++) {
      const elem = this.layout.elements[i];

      gl.enableVertexAttribArray(i);
      // This is really confusing, gl.vertexAttribPointer takes (index, SIZE, ...)
      // size in this case is NOT the size of the elements, but instead the number of components
      gl.vertexAttribPointer(
        i,
        elem.count,
        elem.type,
        elem.normalized,
        this.layout.stride,
        offset
      );
      offset += elem.count * elem.size;
    }
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
