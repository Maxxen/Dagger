import { Effect } from "./Effect";
import { VAO } from "./VAO";
import { VBO } from "./VBO";
import { VertexLayout } from "./VertexLayout";
import { gl } from "../Game";

export class Mesh {
  vao: VAO = new VAO();
  vbo: VBO;
  effect: Effect<any, any, any, any>;

  constructor(
    data: Float32Array,
    layout: VertexLayout,
    effect: Effect<any, any, any, any>
  ) {
    this.vbo = new VBO(data);
    this.vao.addBuffer(this.vbo, layout);
    this.effect = effect;
  }

  draw() {
    // Apply effect
    this.effect.use();

    // Bind VAO
    this.vao.bind();

    // Draw mesh2!
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
