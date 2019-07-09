import {gl} from "../Game";


export class VBO {

  public data : Float32Array

  private id : WebGLBuffer;

  constructor(data : Float32Array) {
    this.id = gl.createBuffer()!;
    this.data = data;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  bind(){
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
  }

  unbind(){
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}
