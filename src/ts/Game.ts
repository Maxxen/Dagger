import {compileShader, createShaderProgram} from "./Graphics/Shader";
import { VAO } from './Graphics/VAO';
import { VBO } from './Graphics/VBO';
import { VBOLayout } from './Graphics/VBOLayout';
import { Camera } from "./Graphics/Camera";
import { mat4 } from "gl-matrix";

export declare var gl : WebGLRenderingContext;
export declare var glext: OES_vertex_array_object;

export function initGL() {
  const canvas = <HTMLCanvasElement> document.querySelector("#glCanvas")!;
    // Initialize the GL context
    const ctx = canvas.getContext("webgl");  

    // Only continue if WebGL is available and working
    if (ctx === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
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

    

    // Compile shaders
    const vert = compileShader(vsSource, gl.VERTEX_SHADER)!;
    const frag = compileShader(fsSource, gl.FRAGMENT_SHADER)!;

    // Create program
    const program = createShaderProgram(vert, frag)!;

  
    // Create VAO
 
    const data = new Float32Array([
      -1.0, -1.0, 0.0,  1, 0, 0, 1,
      1.0, -1.0, 0.0,   0, 1, 0, 1,
      0.0, 1.0, 0.0,    0, 0, 1, 1
    ])


    const vao = new VAO();
    const vbo = new VBO(data);
    const layout = new VBOLayout();

    layout.addAttribute(gl.FLOAT, 3);
    layout.addAttribute(gl.FLOAT, 4);
    vao.addBuffer(vbo, layout);
   
    
    const camera : Camera = new Camera([-1, 0, -3]);

    

    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    // Clear screen
    gl.clearColor(0, 0, 0.4, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Bind program
    gl.useProgram(program);

     // Bind MVP Matrix Uniforms
    gl.uniformMatrix4fv(
      gl.getUniformLocation(program, "P")!,
      false,
      camera.projection);
    gl.uniformMatrix4fv(
      gl.getUniformLocation(program, "V")!,
      false,
      camera.view);

    const model = mat4.create();
    gl.uniformMatrix4fv(
      gl.getUniformLocation(program, "M")!,
      false,
      model);

    // Bind VAO
    vao.bind();
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}