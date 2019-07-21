import { Game } from "./Game";
import { gl } from "./Graphics/gl";
import { Camera } from "./Graphics/Camera";
import { Mesh } from "./Graphics/Mesh";
import { ColorTextureMaterial } from "./Graphics/Material/ColorTextureMaterial";
import { GeometryBuilder } from "./Graphics/GeometryBuilder";
import { Vector3 } from "./Graphics/Vector3";
import { Color } from "./Graphics/Color";
import { Loader } from "./Graphics/Loader";
import { Vector2 } from "./Graphics/Vector2";
import { VertexPositionColorUV } from "./Graphics/Vertex";
import { TextureWrap, TextureFilter } from "./Graphics/Texture2D";

const builder = new GeometryBuilder<VertexPositionColorUV>();
const geometry = builder
  .addQuad(
    new VertexPositionColorUV(
      new Vector3(0, 1, 0),
      Color.White,
      new Vector2(0, 0)
    ),
    new VertexPositionColorUV(
      new Vector3(1, 1, 0),
      Color.White,
      new Vector2(1, 0)
    ),
    new VertexPositionColorUV(
      new Vector3(0, 0, 0),
      Color.White,
      new Vector2(0, 1)
    ),
    new VertexPositionColorUV(
      new Vector3(1, 0, 0),
      Color.White,
      new Vector2(1, 1)
    )
  )
  .finalize();

export class MyGame extends Game {
  scene: any = {};
  camera: Camera;
  constructor() {
    super();

    // Create Camera
    this.camera = new Camera([-1, 0, -3]);
  }
  load(loader: Loader) {
    loader
      .add(
        "tex1",
        "./assets/test2.png",
        false,
        TextureWrap.CLAMP_EDGE,
        TextureFilter.LINEAR
      )
      .load(textures => {
        const material = new ColorTextureMaterial();
        const matInstance = material.getInstance();
        matInstance.data.texture = textures["tex1"];
        const mesh = new Mesh(geometry, matInstance);

        this.scene["material"] = material;
        this.scene["mesh"] = mesh;

        this.startLoop();
      });
  }
  init() {}
  update(deltaTime: number) {
    this.camera.position = [
      Math.sin(this.lastTimestamp * 0.001) * deltaTime * 0.2,
      Math.cos(this.lastTimestamp * 0.001) * deltaTime * 0.2,
      3
    ];
  }

  draw() {
    const material = this.scene["material"];
    const mesh = this.scene["mesh"];

    material.use();
    material.perPass(this.camera);
    material.perMesh(mesh.material.data);
    mesh.bind();
    gl.drawElements(
      gl.TRIANGLES,
      mesh.geometry.indexCount,
      gl.UNSIGNED_SHORT,
      0
    );
  }
}
