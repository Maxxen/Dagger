interface VertexLayoutElement {
  type: number;
  count: number;
  size: number;
  normalized: boolean;
}

export enum VertexAttribute {
  BYTE = 0x1400,
  UNSIGNED_BYTE = 0x1401,
  SHORT = 0x1402,
  UNSIGNED_SHORT = 0x1403,
  INT = 0x1404,
  UNSIGNED_INT = 0x1405,
  FLOAT = 0x1406
}

export class VertexLayout {
  _elements: VertexLayoutElement[] = [];
  stride: number = 0;

  constructor(...elements: { type: number; count: number }[]) {
    elements.forEach(({ type, count }) => {
      this.add(type, count);
    });
  }

  public get elements() {
    return this._elements;
  }

  public add(type: VertexAttribute, count: number) {
    switch (type) {
      case VertexAttribute.FLOAT: {
        this._elements.push({
          type: type,
          count: count,
          size: 4,
          normalized: false
        });
        this.stride += 4 * count;
        break;
      }

      case VertexAttribute.UNSIGNED_INT: {
        this._elements.push({
          type: type,
          count: count,
          size: 4,
          normalized: false
        });
        this.stride += 4 * count;
        break;
      }

      case VertexAttribute.UNSIGNED_BYTE: {
        this._elements.push({
          type: type,
          count: count,
          size: 1,
          normalized: true
        });
        this.stride += 1 * count;
        break;
      }
      default: {
        alert("Unsupported GL attribute type! " + type);
        break;
      }
    }
    return this;
  }
}
