import { gl } from "./Graphics/gl";
import { Camera } from "./Graphics/Camera";
import { Mesh } from "./Graphics/Mesh";
import { TextureWrap, TextureFilter } from "./Graphics/Texture2D";
import { InputManager, InputEventType } from "./InputManager";
import { QUAD } from "./Graphics/Quad";
import { ColorTextureMaterial } from "./Graphics/Material/ColorTextureMaterial";
import { Scene } from "./Scene";
import { ContentLoader } from "./Graphics/ContentLoader";

export class MyScene extends Scene {
  input: InputManager = new InputManager();

  constructor() {
    super("MyScene", new Camera());
    // Create Camera
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
  load(loader: ContentLoader) {
    loader
      .add(
        "tex1",
        "assets/test2.png",
        false,
        TextureWrap.REPEAT,
        TextureFilter.NEAREST
      )
      .load();
  }
  init() {
    const tex = this.content.get("tex1")!;
    const material = new ColorTextureMaterial();
    const matInstance = material.getInstance();
    matInstance.data.texture = tex;
    this.world["material"] = material;
    this.world["mesh"] = new Mesh(QUAD, matInstance);
  }
  update() {
    this.input.update();
  }
  draw() {
    const material = this.world["material"];
    const mesh = this.world["mesh"];

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

  unload() {}
}
