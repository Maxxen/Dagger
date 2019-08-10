import { VertexBuffer } from "./VertexBuffer";
import { glext, gl } from "./gl";
import { IndexBuffer } from "./IndexBuffer";

export class VertexArrayObject {
  private id: WebGLVertexArrayObjectOES;
  public vertexBuffer: VertexBuffer | null = null;
  public indexBuffer: IndexBuffer | null = null;

  private _vertexCount = 0;
  private _indexCount = 0;

  constructor(vertexBuffer?: VertexBuffer, indexBuffer?: IndexBuffer) {
    this.id = glext.createVertexArrayOES()!;

    if (indexBuffer) {
      this.setIndexBuffer(indexBuffer);
    }
    if (vertexBuffer) {
      this.setBuffer(vertexBuffer);
    }
  }

  public bind() {
    glext.bindVertexArrayOES(this.id);
  }
  public unbind() {
    glext.bindVertexArrayOES(null);
  }

  public setIndexBuffer(indexBuffer: IndexBuffer) {
    this.indexBuffer = indexBuffer;
    this.bind();
    this.indexBuffer.bind();
    this.unbind();

    this._indexCount = indexBuffer.count;
  }

  private setBuffer(vertexBuffer: VertexBuffer) {
    this.vertexBuffer = vertexBuffer;

    this.bind();

    vertexBuffer.bind();
    var offset = 0;
    for (var i = 0; i < vertexBuffer.layout.elements.length; i++) {
      const elem = vertexBuffer.layout.elements[i];

      gl.enableVertexAttribArray(i);
      // This is really confusing, gl.vertexAttribPointer takes (index, SIZE, ...)
      // size in this case is NOT the size of the elements, but instead the number of components
      gl.vertexAttribPointer(
        i,
        elem.count,
        elem.type,
        elem.normalized,
        vertexBuffer.layout.stride,
        offset
      );
      offset += elem.count * elem.size;
    }
    this.unbind();

    this._vertexCount = vertexBuffer.count;
  }

  public get indexCount() {
    return this._indexCount;
  }

  public get vertexCount() {
    return this._vertexCount;
  }
}
