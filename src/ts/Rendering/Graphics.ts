import { BlendStateCache } from "./State/BlendState";
import { SamplerState } from "./State/SamplerState";
import { VertexBuffer } from "../Graphics/VertexBuffer";
import { gl } from "../Graphics/gl";
import { IndexBuffer } from "../Graphics/IndexBuffer";
import { Batcher } from "../Graphics/Batcher";
import { VertexLayout } from "../Graphics/VertexLayout";
import { Texture2D } from "../Graphics/Texture2D";
import { DepthStencilStateCache } from "./State/DepthStencilState";

enum PrimitiveMode {
  TRIANGLES = gl.TRIANGLES,
  TRIANGLE_STRIP = gl.TRIANGLE_STRIP,
  TRIANGLE_FAN = gl.TRIANGLE_FAN,
  POINTS = gl.POINTS,
  LINE = gl.LINES,
  LINE_STRIP = gl.LINE_STRIP,
  LINE_LOOP = gl.LINE_LOOP
}

export class Graphics {
  /**
   * BlendState
   */
  blendState: BlendStateCache = new BlendStateCache();

  /**
   * Depth stencil state
   */
  depthStencilState: DepthStencilStateCache = new DepthStencilStateCache();

  /**
   * SamplerState
   */
  _sampleState: SamplerState = new SamplerState();

  /**
   * Sprite batcher
   */
  spriteBatch: Batcher = new Batcher();

  // Todo, bind buffers with gl instead
  public bindVertexBuffer(vertexBuffer: VertexBuffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer.id);
  }

  public unbindVertexBuffer() {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  public bindIndexBuffer(indexBuffer: IndexBuffer) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer.id);
  }

  public unbindIndexBuffer() {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  public enableVertexAttribArray(layout: VertexLayout) {
    let offset = 0;
    for (let i = 0; i < layout.elements.length; i++) {
      const elem = layout.elements[i];
      gl.enableVertexAttribArray(i);
      // This is really confusing, gl.vertexAttribPointer takes (index, SIZE, ...)
      // size in this case is NOT the size of the elements, but instead the number of components
      gl.vertexAttribPointer(
        i,
        elem.count,
        elem.type,
        elem.normalized,
        layout.stride,
        offset
      );
      offset += elem.count * elem.size;
    }
  }

  public bindTexture2D(texture: Texture2D, unit: number) {
    gl.activeTexture(unit);
    gl.bindTexture(gl.TEXTURE_2D, texture.id);
  }

  // Draw primitives indexed with ushorts
  public drawIndexedPrimitives(
    mode: PrimitiveMode,
    count: number,
    offset: number = 0
  ) {
    gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset * 2);
  }
}
