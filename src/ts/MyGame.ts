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
import { InputManager, InputEventType } from "./InputManager";

const builder = new GeometryBuilder<VertexPositionColorUV>();
const geometry = builder
  .addQuad(
    new VertexPositionColorUV(
      new Vector3(0, 1, 0),
      Color.WHITE,
      new Vector2(0, 0)
    ),
    new VertexPositionColorUV(
      new Vector3(1, 1, 0),
      Color.WHITE,
      new Vector2(1, 0)
    ),
    new VertexPositionColorUV(
      new Vector3(0, 0, 0),
      Color.WHITE,
      new Vector2(0, 1)
    ),
    new VertexPositionColorUV(
      new Vector3(1, 0, 0),
      Color.WHITE,
      new Vector2(1, 1)
    )
  )
  .finalize();

export class MyGame extends Game {
  scene: any = {};
  camera: Camera;
  input: InputManager = new InputManager();

  constructor() {
    super();

    // Create Camera
    this.camera = new Camera();
    this.camera.position = [0, 0, 0];

    this.input.subscribe(ev => {
      if (ev.type == InputEventType.KEY_DOWN) {
        switch (ev.key) {
          case "left":
            this.camera.move([-0.1, 0, 0]);
            break;
          case "right":
            this.camera.move([0.1, 0, 0]);
            break;
        }
      }
    });
  }
  load(loader: Loader, startGame: () => void) {
    loader
      .load([
        "tex1",
        "assets/test2.png",
        false,
        TextureWrap.REPEAT,
        TextureFilter.NEAREST
      ])
      .then(textures => {
        const material = new ColorTextureMaterial();
        const matInstance = material.getInstance();
        matInstance.data.texture = textures[0];
        const mesh = new Mesh(geometry, matInstance);

        this.scene["material"] = material;
        this.scene["mesh"] = mesh;

        startGame();
      })
      .catch(e => console.log(e));
  }
  init() {}
  update() {
    this.input.update();

    this.camera.rotation = Math.cos(this.lastTimestamp * 0.001);
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
