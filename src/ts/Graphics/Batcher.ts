import { VertexBuffer } from "./VertexBuffer";
import { IndexBuffer } from "./IndexBuffer";
import { VertexPositionColorUV } from "./Vertex";
import { gl } from "./gl";
import { Sprite } from "./Sprite";
import { Material } from "./Material";

export class Batcher {
  private dataBuffer: ArrayBuffer;
  private vertexBuffer: VertexBuffer;
  private indexBuffer: IndexBuffer;
  private items: Sprite[];
  private itemCount: number = 0;

  private drawing: boolean = false;

  static readonly MAX_SPRITES = 2048;
  static readonly MAX_VERTICES = Batcher.MAX_SPRITES * 4;
  static readonly MAX_INDICES = Batcher.MAX_SPRITES * 6;

  static readonly indexData: Uint16Array = Batcher.makeIndices();

  public constructor() {
    this.vertexBuffer = new VertexBuffer(VertexPositionColorUV.layout);
    this.indexBuffer = new IndexBuffer(Batcher.indexData);
    this.items = new Array<Sprite>(Batcher.MAX_SPRITES);
    this.dataBuffer = new ArrayBuffer(
      Batcher.MAX_SPRITES * 4 * this.vertexBuffer.layout.stride
    );
  }

  public begin(): void {
    if (this.drawing) {
      throw "Cannot call begin without first calling end!";
    }

    this.drawing = true;
  }

  public end() {
    if (!this.drawing) {
      throw "Cannot call end without first calling begin!";
    }
    this.drawing = false;
    this.flush();
  }

  public batch(sprite: Sprite): void {
    if (this.itemCount >= Batcher.MAX_SPRITES) {
      this.flush();
    }
    this.items[this.itemCount] = sprite;
    this.itemCount++;
  }

  private setupBuffers() {
    for (let i = 0; i < this.itemCount; i++) {
      this.pack(i * 96, this.items[i]);
    }
    this.vertexBuffer.setData(this.dataBuffer);
    this.vertexBuffer.bind();
    this.vertexBuffer.applyAttribs();
    this.indexBuffer.bind();
  }

  /// OLD

  public flush() {
    if (this.itemCount == 0) {
      return;
    }

    this.setupBuffers();

    let material: Material = this.items[0].material;
    let offset: number = 0;

    // Group sprites with the same texture and draw them with a single indexed call
    for (let i = 1; i < this.itemCount; i++) {
      if (this.items[i].material != material) {
        this.drawSprites(material, offset, i - offset);
        material = this.items[i].material;
        offset = i;
      }
    }

    this.drawSprites(material, offset, this.itemCount - offset);

    this.itemCount = 0;

    //this.items = [];
  }

  private drawSprites(material: Material, first: number, count: number) {
    // Ugly ugly ugly
    material.shader.use();
    material.bind();
    gl.drawElements(gl.TRIANGLES, count * 6, gl.UNSIGNED_SHORT, first * 12);
  }

  private pack(offset: number, sprite: Sprite) {
    const bytes = new Uint8Array(this.dataBuffer, offset);
    const floats = new Float32Array(this.dataBuffer, offset);

    const { dimensions, crop, color, origin, depth } = sprite;

    // We unroll the packing to optimize
    // It is faster than .set() for small data sets

    // Bytes 0 to 12
    floats[0] = dimensions.x - origin.x;
    floats[1] = dimensions.y - origin.y;
    floats[2] = depth;

    // bytes 12 to 16
    bytes[12] = color.r;
    bytes[13] = color.g;
    bytes[14] = color.b;
    bytes[15] = color.a;

    // bytes 16 to 24
    floats[4] = crop.x;
    floats[5] = crop.y - crop.height;

    // bytes 24 to 36
    floats[6] = dimensions.x - origin.x;
    floats[7] = dimensions.y - dimensions.height - origin.y;
    floats[8] = depth;

    // bytes 36 to 40
    floats.copyWithin(9, 3, 4);

    // bytes 40 to 48
    floats[10] = crop.x;
    floats[11] = crop.y;

    // bytes 48 to 60
    floats[12] = dimensions.x + dimensions.width - origin.x;
    floats[13] = dimensions.y - origin.y;
    floats[14] = depth;

    // bytes 60 to 64
    floats.copyWithin(15, 3, 4);

    // bytes 64 to 72
    floats[16] = crop.x + crop.width;
    floats[17] = crop.y - crop.height;

    // bytes 72 to 84
    floats[18] = dimensions.x + dimensions.width - origin.x;
    floats[19] = dimensions.y - dimensions.height - origin.y;
    floats[20] = depth;

    //bytes 84 to 88
    floats.copyWithin(21, 3, 4);

    //bytes 88 to 96
    floats[22] = crop.x + crop.width;
    floats[23] = crop.y;
  }

  private static makeIndices(): Uint16Array {
    const indices = new Uint16Array(Batcher.MAX_INDICES);
    for (let i = 0, j = 0; i < Batcher.MAX_INDICES; i += 6, j += 4) {
      indices[i + 0] = j + 0;
      indices[i + 1] = j + 1;
      indices[i + 2] = j + 2;
      indices[i + 3] = j + 2;
      indices[i + 4] = j + 1;
      indices[i + 5] = j + 3;
    }
    return indices;
  }
}
