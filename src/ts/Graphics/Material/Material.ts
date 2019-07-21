import { Shader } from "../Shader";
import { Camera } from "../Camera";
import { mat4 } from "gl-matrix";
import { Texture2D } from "../Texture2D";

export type MaterialParams = { [key: string]: number | mat4 | Texture2D };

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
