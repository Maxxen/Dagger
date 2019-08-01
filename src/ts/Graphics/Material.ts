import { Shader } from "./Shader";

export abstract class Material {
  constructor(public readonly shader: Shader) {}

  abstract use(): void;
}
