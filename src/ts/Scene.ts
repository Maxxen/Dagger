import { ContentLoader } from "./ContentLoader";
import { Camera } from "./Graphics/Camera";
import { Game } from "./Game";
import { GameObject } from "./GameObject";
import { Renderer, BasicRenderer } from "./Rendering/Renderer";
import { Renderable } from "./Rendering/Renderable";
import { Graphics } from "./Rendering/Graphics";

export abstract class Scene {
  constructor(public readonly name: string) {}

  // world == layer
  protected world: any = {};

  public renderList: Renderable[] = [];
  public readonly camera: Camera = new Camera();

  public renderer: Renderer = new BasicRenderer(0, new Graphics());

  abstract load(loader: ContentLoader): void;

  abstract init(): void;

  abstract update(deltaTime: number): void;

  public draw(): void {
    this.renderer.render(this.camera, this);
  }

  abstract unload(): void;

  protected gameObjects: GameObject[] = [];
}

export class DefaultScene extends Scene {
  constructor() {
    super("default");
  }
  load() {}
  draw() {}
  init() {}
  update() {}
  unload() {}
}

export class SceneManager {
  private scenes: { [key: string]: Scene } = {};
  private currentScene: Scene;

  public constructor(defaultScene: Scene) {
    this.currentScene = defaultScene;
  }

  public switchScene(name: string) {
    const toLoad = this.scenes[name];
    toLoad.load(
      Game.instance.content.createLoader(() => {
        this.currentScene.unload();
        this.currentScene = this.scenes[name];
        this.currentScene.init();
      })
    );
  }

  public addScene(scene: Scene) {
    this.scenes[scene.name] = scene;
  }

  public update(deltaTime: number) {
    this.currentScene.update(deltaTime);
  }

  public draw() {
    this.currentScene.draw();
  }
}
