import { gl, glext } from "../Game";
import { VBO } from "./VBO";
import { VBOLayout } from "./VBOLayout"

export class VAO {
  
  private id : WebGLVertexArrayObjectOES;

  constructor(){
    this.id = glext.createVertexArrayOES()!
  }

  bind(){
    glext.bindVertexArrayOES(this.id);
  }
  unbind(){
    glext.bindVertexArrayOES(null);
  }

  addBuffer(vertexBuffer : VBO, layout : VBOLayout){
    this.bind();

    vertexBuffer.bind();
    var offset = 0; 
    for (var i = 0; i < layout.elements.length; i++){

      const elem = layout.elements[i];

      gl.enableVertexAttribArray(i);
      // This is really confusing, gl.vertexAttribPointer takes (index, SIZE, ...)
      // size in this case is NOT the size of the elements, but instead the number of components
      gl.vertexAttribPointer(i, elem.count, elem.type, elem.normalized, layout.stride, offset)
      offset += elem.count * elem.size;
    }
  }
}