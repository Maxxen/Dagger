import { Mesh } from './Mesh';
import { mat4 } from "gl-matrix";
import { ShaderProgramInfo } from './ShaderProgramInfo';

export class Sprite {
  
  private mesh : Mesh

  public modelViewMat : mat4;
  public projectionMat : mat4;

  constructor(mesh : Mesh, modelViewMat : mat4, projectionMat : mat4) {
    this.mesh = mesh;

    this.modelViewMat = modelViewMat;
    this.projectionMat = projectionMat;
  }


  draw(gl : WebGLRenderingContext, programInfo : ShaderProgramInfo) : void{
    this.mesh.bind(gl);
    this.mesh.bufferData(gl);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      this.projectionMat);
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      this.modelViewMat);
  }
}

