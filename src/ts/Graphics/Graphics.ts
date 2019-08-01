import { gl } from "./gl";
import { Color } from "./Color";

enum DrawMode {
  TRIANGLES = gl.TRIANGLES,
  TRIANGLE_STRIP = gl.TRIANGLE_STRIP,
  TRIANGLE_FAN = gl.TRIANGLE_FAN,
  POINTS = gl.POINTS,
  LINE = gl.LINES,
  LINE_STRIP = gl.LINE_STRIP,
  LINE_LOOP = gl.LINE_LOOP
}

// TODO, add blend, stencil, sampler and rasterizer options
// A batcher should be able to set it as it pleases

export class Graphics {
  private constructor() {
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
  }

  static _instance: Graphics;

  private _clearColor: Color = Color.BLUE;

  public get clearColor(): Color {
    return this._clearColor;
  }
  public set clearColor(color: Color) {
    this._clearColor = color;
    gl.clearColor(...color.toArray());
  }

  clear() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  drawIndexedPrimitives(mode: DrawMode, count: number, offset: number) {
    gl.drawElements(mode, count, gl.UNSIGNED_SHORT, offset);
  }

  static get instance() {
    return this._instance !== undefined
      ? this._instance
      : (this._instance = new Graphics());
  }
}
