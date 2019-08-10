import { gl } from "./Graphics/gl";
import { Scene, SceneManager, DefaultScene } from "./Scene";
import { ContentStore } from "./ContentLoader";
import { InputManager } from "./InputManager";
export class Game {
  private elapsedTime: number = 0;
  protected then: number = 0;
  private maxFPS: number = 60;
  private timestep: number = 1000 / 60;

  public readonly scenes: SceneManager;
  public readonly content: ContentStore;
  public readonly input: InputManager;

  private static _instance: Game;

  private constructor(scene: Scene) {
    this.scenes = new SceneManager(scene);
    this.content = new ContentStore();
    this.input = new InputManager();
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
    //gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LESS);
  }

  // TODO: Proper time class and constructs.
  private loop(now: number) {
    if (now < this.then + 1000 / this.maxFPS) {
      requestAnimationFrame(this.loop.bind(this));
      return;
    }
    const deltaTime = now - this.then;
    this.elapsedTime += deltaTime;
    this.then = now;

    // Simulate the total elapsed time in fixed-size chunks
    while (this.elapsedTime >= this.timestep) {
      this.input.update();
      this.scenes.update(this.timestep);
      this.elapsedTime -= this.timestep;
    }

    this.clear();
    this.scenes.draw();
    requestAnimationFrame(this.loop.bind(this));
  }

  public clear() {
    // Clear screen
    gl.clearColor(0, 0, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}
