import { Material } from "./Material";
import { Geometry } from "./Geometry";

export interface RenderComponent {
  draw(): void;
  getRenderKey(): number;
  material: Material;
  geometry: Geometry;
}

export interface Renderable {
  readonly renderer: RenderComponent;
}

export function isRenderable(gameObject: any): gameObject is Renderable {
  return gameObject.renderer !== undefined;
}
