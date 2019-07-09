import { gl } from "../Game";

export function compileShader(source : string, type : number) : WebGLShader | null {
  const shaderID = gl.createShader(type)!;

  gl.shaderSource(shaderID, source);
  console.log("Compiling shader " + source);
  gl.compileShader(shaderID);

  if(!gl.getShaderParameter(shaderID, gl.COMPILE_STATUS)) {
    alert("Error compiling shader " + gl.getShaderInfoLog(shaderID));
    gl.deleteShader(shaderID);
    return null
  }
  return shaderID;
}

export function createShaderProgram(vert : WebGLShader, frag : WebGLShader) : WebGLProgram | null {
    const programID = gl.createProgram()!;
    gl.attachShader(programID, vert);
    gl.attachShader(programID, frag);

    gl.linkProgram(programID);

    if(!gl.getProgramParameter(programID, gl.LINK_STATUS)){
      alert("Error linking program " + gl.getProgramInfoLog(programID));
      gl.deleteProgram(programID);
      return null
    }

    gl.detachShader(programID, vert);
    gl.detachShader(programID, frag);

    gl.deleteShader(vert);
    gl.deleteShader(frag);
    
  return programID;
}