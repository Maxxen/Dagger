import { mat4 } from "gl-matrix";
import { Texture2D } from "./Texture2D";
import { Shader } from "./Shader";

export type UniformType =
  | mat4
  | number
  | Texture2D
  | [number, number, number, number];

export abstract class Uniform<T extends UniformType = UniformType> {
  constructor(public readonly name: string, public value: T) {}
  abstract send(shader: Shader): void;
}

export class UniformMat4 extends Uniform<mat4> {
  send(shader: Shader) {
    shader.setMat4(this.name, this.value);
  }
}

export class UniformTexture2D extends Uniform<Texture2D> {
  constructor(
    name: string,
    value: Texture2D,
    private sampler: number,
    private index: number
  ) {
    super(name, value);
  }

  send(shader: Shader) {
    shader.setTexture(this.sampler, this.name, this.value, this.index);
  }
}

export class Uniform1f extends Uniform<number> {
  send(shader: Shader) {
    shader.setFloat(this.name, this.value);
  }
}

export class Uniform4f extends Uniform<[number, number, number, number]> {
  send(shader: Shader) {
    shader.setVec4(this.name, this.value);
  }
}
