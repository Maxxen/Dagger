import { Effect } from "./Effect";
import { VAO } from "./VAO";
import { VBO } from "./VBO";
import { VertexLayout } from "./VertexLayout";
import { Uniform, UniformType } from "./Uniform";
import { gl } from "../Game";

export class Mesh {
  vao: VAO = new VAO();
  vbo: VBO;
  effect: Effect;

  constructor(data: Float32Array, layout: VertexLayout, effect: Effect) {
    this.vbo = new VBO(data);
    this.vao.addBuffer(this.vbo, layout);
    this.effect = effect;
  }

  draw(...extraUniforms: Uniform<UniformType>[]) {
    // Apply effect
    this.effect.use(...extraUniforms);

    // Bind VAO
    this.vao.bind();

    // Draw mesh2!
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
