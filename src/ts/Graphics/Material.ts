import { Shader } from "./Shader";
import { Camera } from "./Camera";
import { mat4 } from "gl-matrix";

export type MaterialParams = { [key: string]: number | mat4 };

export class MaterialInstance<T extends MaterialParams = {}> {
  constructor(public readonly name: string, public data: T) {}
}

export abstract class Material<T extends MaterialParams = {}> {
  constructor(
    public readonly name: string,
    protected shader: Shader,
    private defaultParams: T
  ) {}

  public use() {
    this.shader.use();
  }

  public getInstance(): MaterialInstance<T> {
    return new MaterialInstance<T>(this.name, this.defaultParams);
  }

  public abstract perPass(camera: Camera): void;

  public abstract perMesh(data: T): void;
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

export interface BasicMaterialParams {
  [key: string]: mat4;
  model: mat4;
}
export class BasicMaterial extends Material<BasicMaterialParams> {
  constructor() {
    super("BasicMaterial", new Shader(vsSource, fsSource), {
      model: mat4.create()
    });
  }

  perPass(camera: Camera) {
    this.shader.setMat4("V", camera.view);
    this.shader.setMat4("P", camera.projection);
  }

  perMesh(data: BasicMaterialParams): void {
    this.shader.setMat4("M", data.model);
  }
}
/*
class Scene {
  mats: { [key: string]: Material } = {};
  meshes: Mesh[] = [];
  constructor() {}

  addMaterial(mat: Material, name: string) {
    this.mats[name] = mat;
  }

  draw() {
    for (let mat in this.mats) {
      const material = this.mats[mat];
      material.use();
      material.perPass({} as Camera);

      for (let m in this.meshes) {
        const mesh = this.meshes[m];
        if (mesh.material.name == material.name) {
          material.perMesh(mesh)
          mesh.bind();
          gl.drawElements(
            gl.TRIANGLES,
            mesh.geometry.indexCount,
            gl.UNSIGNED_SHORT,
            0
          );
        }
      }
    }
  }
}
*/
