import { Material } from "../Graphics/Material";
import { Camera } from "../Graphics/Camera";
import { Batcher } from "../Graphics/Batcher";
import { Scene } from "../Scene";
import { Rectangle } from "../Graphics/Rectangle";
import { Color } from "../Graphics/Color";
import { Vector2 } from "../Graphics/Vector2";
import { Geometry } from "../Graphics/Geometry";
import { SpriteMaterial } from "../Graphics/SpriteMaterial";

type RenderJob = SpriteJob | MeshJob;

interface SpriteJob {
  type: "Sprite";
  material: Material;
  dimensions: Rectangle;
  color: Color;
  origin: Vector2;
  crop: Rectangle;
  depth: number;
}

interface MeshJob {
  type: "Mesh";
  material: Material;
  depth: number;
  geometry: Geometry;
}

export enum Transparency {
  OPAQUE,
  TRANSPARENT
}

export class RenderQueue {
  opaque: RenderJob[];
  transparent: RenderJob[];

  public constructor(transparent: RenderJob[], opaque: RenderJob[]) {
    this.opaque = opaque;
    this.transparent = transparent;
  }

  submit(transparency: Transparency, job: RenderJob) {
    if (transparency == Transparency.OPAQUE) {
      this.opaque.push(job);
    } else {
      this.transparent.push(job);
    }
  }
}

export class Renderer {
  public batcher: Batcher = new Batcher();
  public readonly renderOrder: number;

  constructor(renderOrder: number) {
    this.renderOrder = renderOrder;
  }

  private opaque: RenderJob[] = [];
  private transparent: RenderJob[] = [];

  public render(camera: Camera, scene: Scene) {
    let queue = new RenderQueue(this.transparent, this.opaque);

    scene.renderList.forEach(renderable => {
      if (!renderable.isHidden && renderable.isVisible(camera))
        renderable.render(queue, camera);
    });

    // Sort opaque by material and then front to back
    this.opaque.sort((a, b) => {
      return a.material.compareTo(b.material) || b.depth - a.depth;
    });

    // Sort transparent back to front and then by material
    this.transparent.sort((a, b) => {
      return a.material.compareTo(b.material);
    });
    this.transparent.sort((a, b) => {
      return a.depth - b.depth;
    });

    // Draw opaque
    this.renderBucket(this.opaque, camera);

    // Draw transparent
    this.renderBucket(this.transparent, camera);

    this.opaque = [];
    this.transparent = [];
  }

  materialSwaps = 0;
  public renderBucket(bucket: RenderJob[], camera: Camera) {
    let currentMaterial: Material = new SpriteMaterial();
    this.batcher.begin(camera.viewProj);

    for (let job of bucket) {
      if (job.material != currentMaterial) {
        currentMaterial.bind();
        this.batcher.flush();
        currentMaterial = job.material;
        this.materialSwaps++;
      }
      if (job.type == "Sprite") {
        this.batcher.draw(
          job.dimensions,
          job.color,
          job.origin,
          job.crop,
          job.depth
        );
      } else if (job.type == "Mesh") {
        job.material.bind();
        job.geometry.bind();
      }
    }
    this.materialSwaps = 0;

    currentMaterial.bind();
    this.batcher.end();
  }
}
