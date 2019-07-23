import { mat4 } from "gl-matrix";
import { Shader } from "../Shader";
import { Material } from "./Material";
import { Camera } from "../Camera";
import { Texture2D } from "../Texture2D";
import { gl } from "../gl";

const vsSource = `
        attribute vec4 a_position;
        attribute vec4 a_color;
        attribute vec2 a_textureCoord;

        uniform mat4 M;
        uniform mat4 V;
        uniform mat4 P;

        varying vec4 v_color;
        varying mediump vec2 v_textureCoord;

        void main() {
          gl_Position = P * V * M * a_position;
          v_color = a_color;
          v_textureCoord = a_textureCoord;
        }
      `;
const fsSource = `
        precision mediump float;

        varying vec4 v_color;
        varying mediump vec2 v_textureCoord;

        uniform sampler2D u_sampler;

        void main() {
          gl_FragColor = texture2D(u_sampler, v_textureCoord) * v_color;
        }
      `;

export interface ColorTextureMaterialParams {
  [key: string]: mat4 | Texture2D;
  model: mat4;
  texture: Texture2D;
}
export class ColorTextureMaterial extends Material<ColorTextureMaterialParams> {
  constructor() {
    super("ColorTextureMaterial", new Shader(vsSource, fsSource), {
      model: mat4.create(),
      texture: Texture2D.TEXTURE_DEFAULT
    });
  }

  perPass(camera: Camera) {
    this.shader.setMat4("V", camera.view);
    this.shader.setMat4("P", camera.projection);
  }

  perMesh(data: ColorTextureMaterialParams): void {
    this.shader.setMat4("M", data.model);
    this.shader.setTexture(gl.TEXTURE0, "u_sampler", data.texture, 0);
  }
}
