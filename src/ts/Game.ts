import { gl } from "./Graphics/gl";
import { Scene, SceneManager, DefaultScene } from "./Scene";
import { ContentStore } from "./ContentLoader";
import { InputManager } from "./InputManager";
import { Renderer } from "./Renderer";

export class Game {
  private deltaTime: number = 0;
  protected lastTimestamp: number = 0;
  private maxFPS: number = 60;
  private timestep: number = 1000 / 60;

  public readonly scenes: SceneManager;
  public readonly content: ContentStore;
  public readonly input: InputManager;
  private renderer: Renderer;

  private static _instance: Game;

  private constructor(scene: Scene) {
    this.scenes = new SceneManager(scene);
    this.content = new ContentStore();
    this.input = new InputManager();
    this.renderer = new Renderer();
  }

  static get instance(): Game {
    if (!this._instance) {
      Game._instance = new Game(new DefaultScene());
    }
    return Game._instance;
  }

  public start() {
    this.setup();
    requestAnimationFrame(this.loop.bind(this));
  }

  private setup() {
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
  }

  // TODO: Proper time class and constructs.
  private loop(timestamp: number) {
    if (timestamp < this.lastTimestamp + 1000 / this.maxFPS) {
      requestAnimationFrame(this.loop.bind(this));
      return;
    }
    this.deltaTime += timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Simulate the total elapsed time in fixed-size chunks
    while (this.deltaTime >= this.timestep) {
      this.input.update();
      this.scenes.update(this.timestep);
      this.deltaTime -= this.timestep;
    }

    this.clear();
    this.scenes.draw(this.renderer);
    requestAnimationFrame(this.loop.bind(this));
  }

  private clear() {
    this.renderer.clear();
  }
}
