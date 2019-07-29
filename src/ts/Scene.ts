import { ContentLoader, ContentStore } from "./Graphics/ContentLoader";
import { Camera } from "./Graphics/Camera";

export abstract class Scene {
  content: ContentStore = new ContentStore();
  constructor(public readonly name: string, public readonly camera: Camera) {}

  // world == layer
  protected world: any = {};

  abstract load(loader: ContentLoader): void;

  abstract init(): void;

  abstract update(deltaTime: number): void;

  abstract draw(): void;

  abstract unload(): void;
}

export class DefaultScene extends Scene {
  constructor() {
    super("default", new Camera());
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
      toLoad.content.createLoader(() => {
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
