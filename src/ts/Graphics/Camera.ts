import { gl } from "../Game";
import { mat4 } from "gl-matrix";

export class Camera {
  _position: number[];
  target: number[] = [0, 0, 0];

  fieldOfView = (45 * Math.PI) / 180; // in radians
  aspect: number;
  zNear: number = 0.1;
  zFar: number = 100.0;
  projectionMatrix: mat4 = mat4.create();
  viewMatrix: mat4 = mat4.create();

  constructor(position: number[]) {
    this._position = position;
    this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    this.updateMatrices();
  }

  private updateMatrices() {
    mat4.perspective(
      this.projectionMatrix,
      this.fieldOfView,
      this.aspect,
      this.zNear,
      this.zFar
    );

    mat4.lookAt(this.viewMatrix, this._position, this.target, [0, 1, 0]);
  }

  public get position(): number[] {
    return this._position;
  }

  public set position(position: number[]) {
    this._position = position;
    this.updateMatrices();
  }

  public get projection() {
    return this.projectionMatrix;
  }

  public get view() {
    return this.viewMatrix;
  }
}
