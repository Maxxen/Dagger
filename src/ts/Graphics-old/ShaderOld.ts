import { ShaderProgramInfo } from "./ShaderProgramInfo";

export class Shader {

  public shaderProgram : WebGLProgram | null = null;
  public shaderProgramInfo : ShaderProgramInfo | null = null;

  constructor(gl : WebGLRenderingContext, vsSource : string, fsSource : string, attributes : {[key : string] : string}, uniforms : {[key : string] : string}){
    
    const shaderProgram = this.initProgram(gl, vsSource, fsSource);
    if(shaderProgram){
      this.shaderProgram = shaderProgram;
      this.shaderProgramInfo = new ShaderProgramInfo(gl, this.shaderProgram, attributes, uniforms)
    }
  }

  initProgram(gl : WebGLRenderingContext, vsSource : string, fsSource : string) : WebGLProgram | null{

    // TODO, properly handle when vertex and fragment loading fails

    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource)!;
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource)!;
    
    const shaderProgram = gl.createProgram();
    if(shaderProgram){
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      
      gl.linkProgram(shaderProgram);

      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
      }
    }
    else {
      alert("Could not create program")
      return null;
    }
    return shaderProgram;
  }

  loadShader(gl : WebGLRenderingContext, type : number, source : string) : WebGLShader | null {
    const shader = gl.createShader(type);

    if(shader){
      gl.shaderSource(shader, source);

      gl.compileShader(shader);

      if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error compiling shader " + gl.getShaderInfoLog);
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }
    else {
      alert("failed to create shader with type: " + type);
      return null;
    }
  }
} 