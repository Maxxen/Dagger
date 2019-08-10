import { BlendState } from "./State/BlendState";
import { DepthStencilState } from "./State/DepthStencilState";
import { SamplerState } from "./State/SamplerState";
import { VertexBuffer } from "../Graphics/VertexBuffer";
import { gl } from "../Graphics/gl";
import { IndexBuffer } from "../Graphics/IndexBuffer";
import { Batcher } from "../Graphics/Batcher";
import { VertexArrayObject } from "../Graphics/VertexArrayObject";

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
  blendState: BlendState = BlendState.Opaque;
  depthStencilState: DepthStencilState = new DepthStencilState();
  sampleState: SamplerState = new SamplerState();

  spriteBatch: Batcher = new Batcher();

  // Todo, bind buffers with gl instead
  public setVBO(vertexBuffer: VertexBuffer) {
    vertexBuffer.bind();
  }

  public setIBO(indexBuffer: IndexBuffer) {
    indexBuffer.bind();
  }

  public setVAO(vertexArrayObject: VertexArrayObject) {
    vertexArrayObject.bind();
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
