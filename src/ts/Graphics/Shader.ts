import { gl } from "../Game";

export class Shader {
  private program: WebGLProgram;

  constructor(vSource: string, fSource: string) {
    // Compile shaders
    const vert = this.compileShader(vSource, gl.VERTEX_SHADER)!;
    const frag = this.compileShader(fSource, gl.FRAGMENT_SHADER)!;

    // Create program
    this.program = this.createShaderProgram(vert, frag)!;
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

  public getUniformCount(): number {
    return gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
  }

  public getUniformNames(): string[] {
    const count = this.getUniformCount();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(this.program, i)!;
      names.push(info.name);
    }
    return names;
  }

  public getUniformLocations(): { [key: string]: WebGLUniformLocation } {
    const locations: { [key: string]: WebGLUniformLocation } = {};

    const count = this.getUniformCount();
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(this.program, i)!;
      locations[info.name] = gl.getUniformLocation(this.program, info.name)!;
    }
    return locations;
  }
}
