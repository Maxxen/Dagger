import { Uniform } from "./Uniforms";
import { Shader } from "./Shader";

export abstract class Material {
  constructor(
    public readonly shaderName: string,
    public data: { [key: string]: Uniform }
  ) {}

  public use(shader: Shader) {
    for (let uniform in this.data) {
      this.data[uniform].send(shader);
    }
  }
}
