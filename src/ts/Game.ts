import { gl } from "./Graphics/gl";
import { Scene, SceneManager } from "./Scene";

export class Game {
  private deltaTime: number = 0;
  protected lastTimestamp: number = 0;
  private maxFPS: number = 60;
  private timestep: number = 1000 / 60;
  public readonly sceneManager: SceneManager;

  constructor(scene: Scene) {
    this.sceneManager = new SceneManager(scene);
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
      this.sceneManager.update(this.timestep);
      this.deltaTime -= this.timestep;
    }

    this.clear();
    this.sceneManager.draw();
    requestAnimationFrame(this.loop.bind(this));
  }

  private clear() {
    // Clear screen
    gl.clearColor(0, 0, 0.4, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}
