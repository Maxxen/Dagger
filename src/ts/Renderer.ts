import { GameObject } from "./GameObject";
import { gl } from "./Graphics/gl";
import { Camera } from "./Graphics/Camera";
import { isRenderable, RenderComponent } from "./Graphics/Renderable";

export class Renderer {
  renderQueue: RenderComponent[] = [];

  public constructor() {}

  public register(obj: GameObject) {
    if (isRenderable(obj)) {
      this.renderQueue.push(obj.renderer);
    }
  }

  private sortRenderables() {
    this.renderQueue.sort((a, b) => {
      return a.getRenderKey() - b.getRenderKey();
    });
  }

  public render(camera: Camera) {
    this.sortRenderables();

    let currentShaderID = 0;
    this.renderQueue.forEach(renderable => {
      if (renderable.getRenderKey() !== currentShaderID) {
        const newShader = renderable.material.shader;
        currentShaderID = newShader.id;
        newShader.use();

        newShader.setMat4("V", camera.view);
        newShader.setMat4("P", camera.projection);
      }

      renderable.draw();

      gl.drawElements(
        gl.TRIANGLES,
        renderable.geometry.indexCount,
        gl.UNSIGNED_SHORT,
        0
      );
    });
    this.renderQueue = [];
  }

  public clear() {
    gl.clearColor(0, 0, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Clear screen
  }
}
