import { Shader } from "./Shader";
import { Uniform, UniformType } from "./Uniform";
import { gl } from "../Game";
import { mat4 } from "gl-matrix";

export class Material {
  shader: Shader;
  locations: { [key: string]: WebGLUniformLocation };
  uniforms: Uniform<UniformType>[];

  constructor(shader: Shader, ...uniforms: Uniform<UniformType>[]) {
    this.shader = shader;
    this.uniforms = uniforms;

    // Fetch all uniform locations once and map from name to location so we can
    // quickly query location just by name without having to jump to GPU
    this.locations = shader.getUniformLocations();
  }

  public setMat4(name: string, value: mat4) {
    gl.uniformMatrix4fv(this.locations[name], false, value);
  }

  public setFloat(name: string, value: number) {
    gl.uniform1f(this.locations[name], value);
  }

  // ... figure out a efficient and easy way to store constant uniforms
  // given when constructing (or parsing from serialization) the material.

  // Ideally, use() would set all the constant uniforms stored in the material
  // instance and additionally set uniforms given by a parameter.

  // I think something like this is more like it.
  // Although, wouldnt it be nice if we could compute uniform values on the fly?
  // Perhaps by passing a closure. I.E.
  // new Uniform("Projection", () => {camera.projection}

  public use(...additionalUniforms: Uniform<UniformType>[]) {
    this.shader.use();

    this.uniforms.forEach(u => {
      u.send(this.locations[u.name]);
    });

    additionalUniforms.forEach(u => {
      u.send(this.locations[u.name]);
    });

    console.log("Uniforms: ");
    for (let key in this.locations) {
      console.log(key);
    }
  }
}
