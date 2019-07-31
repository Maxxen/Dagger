import { Renderable } from "./Renderable";
import { mat4 } from "gl-matrix";
import { UniformMat4, UniformTexture2D, Uniform4f } from "./Uniforms";
import { Texture2D } from "./Texture2D";
import { gl } from "./gl";
import { QUAD } from "./Quad";
import { Geometry } from "./Geometry";
import { Material } from "./Material";
import { GameObject } from "../GameObject";

class SpriteMaterial extends Material {
  constructor() {
    super("SHADER_COLOR_TEXTURE", {
      model: new UniformMat4("M", mat4.create()),
      texture: new UniformTexture2D(
        "u_sampler",
        Texture2D.TEXTURE_DEFAULT,
        gl.TEXTURE0,
        0
      ),
      color: new Uniform4f("u_color", [1, 1, 1, 1])
    });
  }
}

export class Sprite extends GameObject implements Renderable {
  material: SpriteMaterial = new SpriteMaterial();
  geometry: Geometry = QUAD;
  isRenderable = true as const;

  constructor(texture?: Texture2D) {
    super();
    if (texture) {
      this.material.data.texture.value = texture;
    }
  }
}
