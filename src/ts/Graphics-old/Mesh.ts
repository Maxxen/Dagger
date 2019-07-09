export class Mesh {

  private vertexBuffer : WebGLBuffer;
  private indexBuffer : WebGLBuffer;

  private vertices : number[] = [];
  private indices : number[] = [];

  get vertexCount(){return this.vertices.length};
  get indexCount(){return this.indices.length};

  constructor(gl : WebGLRenderingContext){

    this.vertexBuffer = gl.createBuffer()!;
    this.indexBuffer = gl.createBuffer()!;
  }

  define(vertices : number[], indices : number[]){
    this.vertices = vertices;
    this.indices = indices;
  }


  bind(gl : WebGLRenderingContext){
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  }

  bufferData(gl : WebGLRenderingContext){
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW)
  }
}