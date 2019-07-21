import { Game, gl } from "./Game";
import { Camera } from "./Graphics/Camera";
import { Mesh } from "./Graphics/Mesh";
import { BasicMaterial, Material } from "./Graphics/Material";
import { GeometryBuilder } from "./Graphics/GeometryBuilder";
import { VertexPositionColor } from "./Graphics/Vertex";
import { Vector3 } from "./Graphics/Vector3";
import { Color } from "./Graphics/Color";

export class MyGame extends Game {
  material: Material;
  mesh: Mesh;
  camera: Camera;
  constructor() {
    super();

    const builder = new GeometryBuilder<VertexPositionColor>();
    const geometry = builder
      .add(new VertexPositionColor(new Vector3(-1, -1, 0), Color.Red))
      .add(new VertexPositionColor(new Vector3(1, -1, 0), Color.Green))
      .add(new VertexPositionColor(new Vector3(0, 1, 0), Color.Blue))
      .finalize();

    const material = new BasicMaterial();
    const mesh = new Mesh(geometry, material.getInstance());

    this.material = material;
    this.mesh = mesh;
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
    this.material.perMesh(this.mesh.material.data);
    this.mesh.bind();
    gl.drawElements(
      gl.TRIANGLES,
      this.mesh.geometry.indexCount,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}
