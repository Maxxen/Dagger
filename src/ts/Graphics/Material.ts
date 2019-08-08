import { Shader } from "./Shader";
import { Comparable } from "../Comparable";

export abstract class Material implements Comparable<Material> {
  static nextId: number = 0;
  private id: number = 0;

  constructor(public readonly shader: Shader, public readonly type: string) {
    this.id = Material.nextId++;
  }

  abstract bind(): void;

  public compareTo(other: Material) {
    return this.shader.compareTo(other.shader) || this.id - other.id;
  }
}
