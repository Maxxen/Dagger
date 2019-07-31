import { Material } from "./Material";
import { Geometry } from "./Geometry";

export interface Renderable {
  material: Material;
  geometry: Geometry;
  isRenderable: true;
}

export function isRenderable(gameObject: any): gameObject is Renderable {
  return gameObject.isRenderable;
}
