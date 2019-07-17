import { Shader } from "./Shader";
import { Uniform, UniformType } from "./Uniform";

export type UniformGroup = { [key: string]: Uniform<UniformType> };

export class Effect {
  locations: { [key: string]: WebGLUniformLocation };

  constructor(
    private shader: Shader,
    private constants: UniformGroup,
    args: UniformGroup
  ) {
    this.shader = shader;

    // Fetch all uniform locations once and map from name to location so we can
    // quickly query location just by name without having to jump to GPU
    this.locations = shader.getUniformLocations();
  }

  public use(args: UniformGroup) {
    this.shader.use();

    console.log("Constant Uniforms bound: ");
    for (const name in this.constants) {
      this.constants[name].send(this.locations[name]);
      console.log(name);
    }

    console.log("Dynamic Uniforms bound: ");
    for (const name in args) {
      args[name].send(this.locations[name]);
      console.log(name);
    }
  }
}
