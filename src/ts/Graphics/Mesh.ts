import { Geometry } from "./Geometry";
import { Material } from "./Material";
import { Renderable } from "./Renderable";

export class Mesh implements Renderable {
  isRenderable = true as const;
  constructor(public readonly geometry: Geometry, public material: Material) {}
}
