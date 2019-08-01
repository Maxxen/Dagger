import { gl } from "./gl";

export class IndexBuffer {
  public readonly id: WebGLBuffer;
  private _count: number = 0;

  constructor(indices?: Uint16Array) {
    this.id = gl.createBuffer()!;

    if (indices) {
      this.setData(indices);
    }
  }

  public setData(indices: Uint16Array) {
    this._count = indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  public bind() {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
  }

  public unbind() {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  public dispose() {
    gl.deleteBuffer(this.id);
  }

  public get count(): number {
    return this._count;
  }
}
