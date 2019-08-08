import { gl } from "./gl";
import { mat4 } from "gl-matrix";
import { Texture2D } from "./Texture2D";
import { Comparable } from "../Comparable";

let nextShaderID: number = 1;

export class Shader implements Comparable<Shader> {
  public readonly id: number;
  private program: WebGLProgram;
  private uniformLocations: { [key: string]: WebGLUniformLocation };

  constructor(public readonly name: string, vSource: string, fSource: string) {
    // Compile shaders
    const vert = this.compileShader(vSource, gl.VERTEX_SHADER)!;
    const frag = this.compileShader(fSource, gl.FRAGMENT_SHADER)!;

    // Create program
    this.program = this.createShaderProgram(vert, frag)!;

    // Cache uniform locations
    this.use();
    this.uniformLocations = this.getUniformLocations();

    // Generate a new id
    this.id = nextShaderID++;
  }

  private compileShader(source: string, type: number): WebGLShader | null {
    const shaderID = gl.createShader(type)!;

    gl.shaderSource(shaderID, source);
    console.log("Compiling shader " + source);
    gl.compileShader(shaderID);

    if (!gl.getShaderParameter(shaderID, gl.COMPILE_STATUS)) {
      alert("Error compiling shader " + gl.getShaderInfoLog(shaderID));
      gl.deleteShader(shaderID);
      return null;
    }
    return shaderID;
  }

  private createShaderProgram(
    vert: WebGLShader,
    frag: WebGLShader
  ): WebGLProgram | null {
    const programID = gl.createProgram()!;
    gl.attachShader(programID, vert);
    gl.attachShader(programID, frag);

    gl.linkProgram(programID);

    if (!gl.getProgramParameter(programID, gl.LINK_STATUS)) {
      alert("Error linking program " + gl.getProgramInfoLog(programID));
      gl.deleteProgram(programID);
      return null;
    }

    gl.detachShader(programID, vert);
    gl.detachShader(programID, frag);

    gl.deleteShader(vert);
    gl.deleteShader(frag);
    return programID;
  }

  public use() {
    gl.useProgram(this.program);
  }

  private getUniformCount(): number {
    return gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
  }

  private getUniformLocations(): { [key: string]: WebGLUniformLocation } {
    const locations: { [key: string]: WebGLUniformLocation } = {};

    const count = this.getUniformCount();
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(this.program, i)!;
      locations[info.name] = gl.getUniformLocation(this.program, info.name)!;
    }
    return locations;
  }

  public setMat4(name: string, value: mat4) {
    gl.uniformMatrix4fv(this.uniformLocations[name], false, value);
  }

  public setFloat(name: string, value: number) {
    gl.uniform1f(this.uniformLocations[name], value);
  }

  public setVec4(name: string, value: [number, number, number, number]) {
    gl.uniform4f(
      this.uniformLocations[name],
      value[0],
      value[1],
      value[2],
      value[3]
    );
  }

  public setTexture(
    sampler: number,
    sampleName: string,
    texture: Texture2D,
    slot: number
  ) {
    gl.activeTexture(sampler);

    texture.bind();

    gl.uniform1i(this.uniformLocations[sampleName], slot);
  }

  public compareTo(other: Shader) {
    return this.id - other.id;
  }
}
