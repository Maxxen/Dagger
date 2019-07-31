import { GameObject } from "./GameObject";
import { gl } from "./Graphics/gl";
import { Camera } from "./Graphics/Camera";
import { Shader } from "./Graphics/Shader";
import { Renderable, isRenderable } from "./Graphics/Renderable";
import { SHADER_TEXTURE_COLOR } from "./Graphics/Shaders";

export class Renderer {
  public shaders: Shader[] = [SHADER_TEXTURE_COLOR];
  renderQueue: { [key: string]: Renderable[] };

  public constructor() {
    this.renderQueue = {};
    this.shaders.forEach(shader => {
      this.renderQueue[shader.name] = [];
    });
  }

  public register(obj: GameObject) {
    if (isRenderable(obj)) {
      this.renderQueue[obj.material.shaderName].push(obj);
    }
  }

  public render(camera: Camera) {
    this.shaders.forEach(shader => {
      shader.use();

      shader.setMat4("V", camera.view);
      shader.setMat4("P", camera.projection);

      const meshes = this.renderQueue[shader.name];

      meshes.forEach(renderable => {
        renderable.material.use(shader);
        renderable.geometry.bind();

        gl.drawElements(
          gl.TRIANGLES,
          renderable.geometry.indexCount,
          gl.UNSIGNED_SHORT,
          0
        );
      });
    });

    for (let bucket in this.renderQueue) {
      this.renderQueue[bucket] = [];
    }
  }

  public clear() {
    // Clear screen
    gl.clearColor(0, 0, 0.4, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}
