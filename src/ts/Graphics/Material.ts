import { Shader } from "./Shader";
import { Camera } from "./Camera";
import { Mesh } from "./Mesh";
import { gl } from "../Game";

export abstract class Material {
  constructor(public readonly name: string, protected shader: Shader) {}

  public use() {
    this.shader.use();
  }

  abstract perPass(camera: Camera): void;

  abstract perMesh(mesh: Mesh): void;
}

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

export class BasicMaterial extends Material {
  constructor() {
    super("BasicMaterial", new Shader(vsSource, fsSource));
  }

  perPass(camera: Camera) {
    this.shader.setMat4("V", camera.view);
    this.shader.setMat4("P", camera.projection);
  }

  perMesh(mesh: Mesh): void {
    this.shader.setMat4("M", mesh.model);
    gl.drawElements(
      gl.TRIANGLES,
      mesh.geometry.indexCount,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}
