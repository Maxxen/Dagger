import { Geometry } from "./Geometry";
import { MaterialInstance, MaterialParams } from "./Material";

export class Mesh<T extends MaterialParams = {}> {
  constructor(
    public readonly geometry: Geometry,
    public material: MaterialInstance<T>
  ) {}

  bind() {
    this.geometry.bind();
  }
}
