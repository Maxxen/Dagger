export enum AttribType {
  BYTE = 0x1400,
  UNSIGNED_BYTE = 0x1401,
  SHORT = 0x1402,
  UNSIGNED_SHORT = 0x1403,
  INT = 0x1404,
  UNSIGNED_INT = 0x1405,
  FLOAT = 0x1406
}

export type AttribSize = 1 | 2 | 3 | 4;
export type AttribCount = 1 | 2 | 3 | 4;

interface AttribElement {
  type: AttribType;
  count: AttribCount;
  size: AttribSize;
  normalized: boolean;
}

export class VertexLayout {
  private _elements: AttribElement[] = [];
  private stride: number = 0;

  public constructor(...elements: { type: AttribType; count: AttribCount }[]) {
    elements.forEach(({ type, count }) => {
      this.add(type, count);
    });
  }

  public get elements() {
    return this._elements;
  }

  protected add(type: AttribType, count: AttribCount) {
    switch (type) {
      case AttribType.FLOAT: {
        this._elements.push({
          type: type,
          count: count,
          size: 4,
          normalized: false
        });
        this.stride += 4 * count;
        break;
      }

      case AttribType.UNSIGNED_INT: {
        this._elements.push({
          type: type,
          count: count,
          size: 4,
          normalized: false
        });
        this.stride += 4 * count;
        break;
      }

      case AttribType.UNSIGNED_BYTE: {
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
  }
}
