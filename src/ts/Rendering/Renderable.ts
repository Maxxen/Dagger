import { Material } from "../Graphics/Material";
import { Camera } from "../Graphics/Camera";
import { Graphics } from "./Graphics";

export interface Renderable {
  material: Material;
  isHidden: boolean;
  depth: number;

  isVisible(camera: Camera): boolean;
  render(graphics: Graphics, camera: Camera): void;
}
