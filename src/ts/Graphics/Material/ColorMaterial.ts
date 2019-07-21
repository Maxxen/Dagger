import { mat4 } from "gl-matrix";
import { Shader } from "../Shader";
import { Material } from "./Material";
import { Camera } from "../Camera";

const vsSource = `
        attribute vec4 a_position;
        attribute vec4 a_color;

        uniform mat4 M;
        uniform mat4 V;
        uniform mat4 P;

        varying vec4 v_color;

        void main() {
          gl_Position = P * V * M * a_position;
          v_color = a_color;
        }
      `;
const fsSource = `
        precision mediump float;

        varying vec4 v_color;

        void main() {
          gl_FragColor = v_color;
        }
      `;

export interface ColorMaterialParams {
  [key: string]: mat4;
  model: mat4;
}
export class ColorMaterial extends Material<ColorMaterialParams> {
  constructor() {
    super("BasicMaterial", new Shader(vsSource, fsSource), {
      model: mat4.create()
    });
  }

  perPass(camera: Camera) {
    this.shader.setMat4("V", camera.view);
    this.shader.setMat4("P", camera.projection);
  }

  perMesh(data: ColorMaterialParams): void {
    this.shader.setMat4("M", data.model);
  }
}
