import { Shader } from "./Shader";
import { Uniform, UniformType } from "./Uniform";

type KV = { [key: string]: string };

type Textures = {};
type Uniforms = { [key: string]: Uniform<UniformType> };

interface ShaderInfo<
  VT extends Textures,
  VU extends Uniforms,
  FT extends Textures,
  FU extends Uniforms
> {
  attributes: KV;
  varying: KV;
  vert: ShaderParams<VT, VU>;
  frag: ShaderParams<FT, FU>;
}

interface ShaderParams<T extends Textures, U extends Uniforms> {
  textures: T;
  uniforms: U;
  source: string;
}

export class Effect<
  VT extends Textures,
  VU extends Uniforms,
  FT extends Textures,
  FU extends Uniforms
> {
  public uniforms: VU & FU & { [key: string]: any };
  private shader: Shader;
  private locations: { [key: string]: WebGLUniformLocation };

  constructor(info: ShaderInfo<VT, VU, FT, FU>) {
    this.uniforms = { ...info.vert.uniforms, ...info.frag.uniforms };
    this.shader = new Shader(info.vert.source, info.frag.source);
    this.locations = this.shader.getUniformLocations();
  }

  public use() {
    this.shader.use();
    console.log("Uniforms bound: ");
    for (const name in this.uniforms) {
      this.uniforms[name].send(this.locations[name]);
      console.log(name);
    }
  }
}
