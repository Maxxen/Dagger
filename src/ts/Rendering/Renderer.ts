import { Camera } from "../Graphics/Camera";
import { Scene } from "../Scene";
import { Renderable } from "./Renderable";
import { Graphics } from "./Graphics";
import { mat4 } from "gl-matrix";

export enum Transparency {
  OPAQUE,
  TRANSPARENT
}

export abstract class Renderer {
  public readonly renderOrder: number;

  protected renderQueue: Renderable[] = [];
  protected graphics: Graphics;

  constructor(renderOrder: number, graphics: Graphics) {
    this.renderOrder = renderOrder;
    this.graphics = graphics;
  }

  abstract render(camera: Camera, scene: Scene): void;
}

export class BasicRenderer extends Renderer {
  public render(camera: Camera, scene: Scene) {
    this.renderQueue = scene.renderList;

    // Sort renderqueue to minimize state changes
    this.renderQueue.sort((a, b) => {
      return a.material.compareTo(b.material);
    });

    this.graphics.spriteBatch.begin(mat4.create());
    for (const renderable of this.renderQueue) {
      if (!renderable.isHidden && renderable.isVisible(camera)) {
        renderable.render(this.graphics, camera);
      }
    }
    this.graphics.spriteBatch.end();
  }
}
