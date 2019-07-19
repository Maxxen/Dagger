export declare var gl: WebGLRenderingContext;
export declare var glext: OES_vertex_array_object;

export function initGL() {
  const canvas = <HTMLCanvasElement>document.querySelector("#glCanvas")!;
  // Initialize the GL context
  const ctx = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (ctx === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }
  const ext = ctx.getExtension("OES_vertex_array_object");

  if (ext === null) {
    alert("OES Vertex array object extension not supported!");
    return;
  }

  gl = ctx;
  glext = ext;
}

export abstract class Game {
  private deltaTime: number = 0;
  protected lastTimestamp: number = 0;
  private maxFPS: number = 60;
  private timestep: number = 1000 / 60;

  constructor() {
    initGL();
  }
  public start() {
    this.setup();
    this.init();
    this.load();

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
      this.update(this.timestep);
      this.deltaTime -= this.timestep;
    }

    this.clear();
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }

  private clear() {
    // Clear screen
    gl.clearColor(0, 0, 0.4, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  abstract init(): void;
  abstract load(): void;
  abstract update(deltaTime: number): void;
  abstract draw(): void;
}
