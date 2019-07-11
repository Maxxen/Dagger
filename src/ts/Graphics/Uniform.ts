import { gl } from "../Game";
import { mat4 } from "gl-matrix";

export type UniformType = mat4 | number;

export abstract class Uniform<T extends UniformType> {
  public value: T;
  public name: string;

  constructor(name: string, value: T) {
    this.name = name;
    this.value = value;
  }
  abstract send(location: WebGLUniformLocation): void;
}

export class UniformMat4 extends Uniform<mat4> {
  send(location: WebGLUniformLocation) {
    gl.uniformMatrix4fv(location, false, this.value);
  }
}
