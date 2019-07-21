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
