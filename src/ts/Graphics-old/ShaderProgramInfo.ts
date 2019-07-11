export class ShaderProgramInfo {
  program: WebGLProgram;
  attribLocations: { [key: string]: number } = {};
  uniformLocations: { [key: string]: WebGLUniformLocation } = {};

  constructor(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    attributes: { [key: string]: string },
    uniforms: { [key: string]: string }
  ) {
    this.program = program;

    for (var key in attributes) {
      this.attribLocations[key] = gl.getAttribLocation(
        program,
        attributes[key]
      );
    }

    for (var key in uniforms) {
      const location = gl.getUniformLocation(program, uniforms[key]);

      if (location) {
        this.uniformLocations[key] = location;
      } else {
        alert(
          "Error, could not get location of uniform: '" + uniforms[key] + "'"
        );
      }
    }
  }
}
