import { Material } from "../Graphics/Material";
import { Camera } from "../Graphics/Camera";
import { RenderQueue } from "./Renderer";

export enum Translucency {
  OPAQUE,
  TRANSPARENT
}

export interface Renderable {
  material: Material;
  isHidden: boolean;
  depth: number;

  isVisible(camera: Camera): boolean;
  render(queue: RenderQueue, camera: Camera): void;
}
