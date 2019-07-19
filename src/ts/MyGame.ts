import { Game } from "./Game";
import { Camera } from "./Graphics/Camera";
import { Mesh } from "./Graphics/Mesh";
import { BasicMaterial, Material } from "./Graphics/Material";
import { GeometryBuilder } from "./Graphics/GeometryBuilder";

export class MyGame extends Game {
  material: Material;
  mesh: Mesh;
  camera: Camera;
  constructor() {
    super();

    const builder = new GeometryBuilder();
    const geometry = builder
      .add([-1, -1, 0], [1, 0, 0, 1])
      .add([1, -1, 0], [0, 1, 0, 1])
      .add([0, 1, 0], [0, 0, 1, 1])
      .finalize();

    this.material = new BasicMaterial();

    this.mesh = new Mesh(geometry, this.material);
    // Create Camera
    this.camera = new Camera([-1, 0, -3]);
  }
  load() {}
  init() {}
  update(deltaTime: number) {
    this.camera.position = [
      Math.sin(this.lastTimestamp * 0.001) * deltaTime * 0.2,
      Math.cos(this.lastTimestamp * 0.001) * deltaTime * 0.2,
      3
    ];
  }

  draw() {
    this.material.use();
    this.material.perPass(this.camera);
    this.mesh.draw();
  }
}
