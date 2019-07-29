export declare var gl: WebGL2RenderingContext;

export function initGL() {
  const canvas = <HTMLCanvasElement>document.querySelector("#glCanvas")!;
  // Initialize the GL context
  const ctx = canvas.getContext("webgl2") as WebGL2RenderingContext;

  // Only continue if WebGL is available and working
  if (ctx === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }
  gl = ctx;
}
