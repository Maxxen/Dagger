import { gl } from "../Game";


interface VBOElement {
  type: number;
  count: number;
  size: number;
  normalized: boolean;
}

export class VBOLayout {
  _elements: VBOElement[] = [];
  stride: number = 0;
  
  public get elements(){
    return this._elements;
  }

  addAttribute(type: number, count : number){
    switch(type){

      case gl.FLOAT: {
        this._elements.push({type: type, count: count, size: 4, normalized: false})
        this.stride += 4 * count;
        break;
      }

      case gl.UNSIGNED_INT: {
        this._elements.push({type: type, count: count, size: 4, normalized: false})
        this.stride += 4 * count;
        break;
      }

      case gl.BYTE: {
        this._elements.push({type: type, count: count, size: 1, normalized: true})
        this.stride += 1 * count;
        break;
      }
      default: {
        alert("Unsupported GL element type! " + type);
        break;
      }
    }
  }
}