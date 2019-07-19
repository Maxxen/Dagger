import { Geometry } from "./Geometry";
import { Material } from "./Material";
import { mat4 } from "gl-matrix";

export class Mesh {
  public model: mat4 = mat4.create();
  constructor(public readonly geometry: Geometry, public material: Material) {}

  draw() {
    this.geometry.bind();
    this.material.perMesh(this);
  }
}
