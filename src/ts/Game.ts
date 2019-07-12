import { Shader } from "./Graphics/Shader";
import { VAO } from "./Graphics/VAO";
import { VBO } from "./Graphics/VBO";
import { VertexLayout, VertexAttribute } from "./Graphics/VertexLayout";
import { Camera } from "./Graphics/Camera";
import { mat4 } from "gl-matrix";
import { UniformMat4, Uniform, UniformType } from "./Graphics/Uniform";
import { Material } from "./Graphics/Material";

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

export class Game {
  start() {
    initGL();

    const vsSource = `
        attribute vec4 a_position;
        attribute vec4 a_color;

        uniform mat4 M;
        uniform mat4 V;
        uniform mat4 P;

        varying vec4 v_color;

        void main() {
          gl_Position = P * V * M * a_position;
          v_color = a_color;
        }
      `;

    const fsSource = `
        precision mediump float;

        varying vec4 v_color;

        void main() {
          gl_FragColor = v_color;
        }
      `;

    // Create program
    const shader = new Shader(vsSource, fsSource);

    // Create VAO

    const data = new Float32Array([
      -1.0,
      -1.0,
      0.0,
      1,
      0,
      0,
      1,
      1.0,
      -1.0,
      0.0,
      0,
      1,
      0,
      1,
      0.0,
      1.0,
      0.0,
      0,
      0,
      1,
      1
    ]);

    // Create vertex layout
    const layout = new VertexLayout(
      { type: VertexAttribute.FLOAT, count: 3 },
      { type: VertexAttribute.FLOAT, count: 4 }
    );

    // Create Camera
    const camera: Camera = new Camera([-1, 0, -3]);

    // Create material
    const mat = new Material(
      shader,
      new UniformMat4("P", camera.projection),
      new UniformMat4("V", camera.view)
    );

    // Create Mesh
    const mesh = new Mesh(data, layout, mat);

    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    // Clear screen
    gl.clearColor(0, 0, 0.4, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw Mesh!
    mesh.draw(new UniformMat4("M", mat4.create()));
  }
}

class Mesh {
  vao: VAO = new VAO();
  vbo: VBO;
  material: Material;

  constructor(data: Float32Array, layout: VertexLayout, material: Material) {
    this.vbo = new VBO(data);
    this.vao.addBuffer(this.vbo, layout);
    this.material = material;
  }

  draw(...extraUniforms: Uniform<UniformType>[]) {
    // Apply material
    this.material.use(...extraUniforms);

    // Bind VAO
    this.vao.bind();

    // Draw mesh!
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
